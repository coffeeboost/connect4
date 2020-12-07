//import data or libraries
const express = require('express')
const session = require("express-session")
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const accountsData = require("./dummyaccounts.json")
const gamesData = require("./dummygames.json")
const { v4: uuidv4 } = require('uuid');

//set up socket
const sessionMiddleware = session({secret: 'codingdefined', resave: false, saveUninitialized: true});
app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

//connect middlewares
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'pug')

//open port
const port=3000
server.listen(3000, ()=>{console.log('http://localhost:3000/');});

//socket functions
io.on('connection', (socket) => {
    const session = socket.request.session;
    io.emit("chat message", `${session.username} entered the chat`)
    socket.on('chat message', (msg) => {
        io.emit('chat message', `${session.username}: `+msg);
      });
    socket.on('disconnect', () => {
        io.emit("chat message", `${session.username} left the chat`)
    });
});

//authorization routes
app.get("/", renderLogin)
app.post("/login", login)
app.post("/logout",logout,renderLogin)
app.route("/signup").get(renderSignUp).post(createUser,auth,renderMyProfile)

//render page routes
app.get("/myfriends",auth,renderMyFriends)
app.get("/mystats",auth,renderMyStats)
app.route("/myprofile").get(auth,renderMyProfile)
                        .post(auth, updatePrivacy)
app.get("/mygames", auth, renderMyGames)
app.get("/howtoplay",renderHowToPlay);

//myfriends functions
app.get("/users",publicSearchUser)
app.route("/users/:name").get(publicSearcSpecifichUser)
                            .put(auth,acceptFriend)
                            .delete(auth,rejectRequest)
app.route("/friend/:name").delete(auth,removeFriend)
                            .put(auth,sendFriendReq)


//game functions
app.get("/game/:id", auth,renderGame)
app.get("/games",publicGameHandler)
app.post("/play/:id/:turn/:col",auth,playMove)
app.route("/creategame",auth).get(renderCreateGameScreen).post(createGame)
app.put("/forfeit/:id",auth,forfeitGame)
app.get("/load/:id/",auth, gameDataHandler)
app.get("/spectateGame/:id",auth,renderSpectateGame)

//404
app.get('*', handle404)
app.get('*/*', handle404)
app.get('*/*/*', handle404)
app.get('*/*/*/*', handle404)

//return data for loading games
//spectate game, view past game and play game uses this
function gameDataHandler(req,res){
    let id  = req.params.id;
    let query = req.query
    let gameData = getGame(id)
    let index;
    let board;
    if(req.header("Accept") == "application/json"){
        gameData.gameBoard = gameData["history"].last()
        gameData.end = gameData.result != "na"
        res.json(gameData)
    }
    if(Object.keys(query).length != 0){
        if(query.index){
            // console.log("specific game board was requested")
            index = req.query.index
            board = JSON.stringify(getPastGameBoard(id,index))
            let next = parseInt(index) + 1
            let prev = parseInt(index) - 1 
            
            res.render('viewgame',{display:board,id:id,players:gameData.players,index:index,next:next,prev:prev,length:gameData.history.length})
        }
        else{
            // console.log('query param does not exist')
        }
    }
    else{
        // console.log('returning data on game')
    }
}
//helper function
//return a specific game board
function getPastGameBoard(gid,index){
    return gamesData[gid].history[index]
}
//render screen
function handle404(req,res){
    res.status(404).render("404");
}
//return data on games for rendering AJAX
function publicGameHandler(req,res){
    let result= [];
    let gameArr = Object.keys(gamesData)
    //filter if params are given
    if(Object.keys(req.query).length != 0 ){
        if(req.query.player){
            gameArr = result.filter((id)=>gamesData[id].players.include(req.query.player))
        }
        if(req.query.active){
            gameArr = result.filter((id)=>gamesData[id].result=="na")
        }
    }
    gameArr.forEach((id)=>{
        let status = gamesData[id].result=="na"?"in progress":"completed"
        let info = {
            name:gamesData[id].players,
            status:status
        }
        let completeData;
        if(status == "completed"){
            completeData = {
                winner:gamesData[id].result, 
                numberOfTurns:gamesData[id].history.length,
                forfeited:gamesData[id].forfeit
            }
            info = Object.assign({},info,completeData)
        }
        if(req.query.detail == "full"){
            info = Object.assign({},info,{moves:gamesData[id].moves})
        }
        result.push(info)      
    })
    res.status(200).json(result)
}
//return data on user
//handles different header types
function publicSearcSpecifichUser(req,res){
    let name = req.params.name
    let user = req.session.username
    if(req.accept == "applications/json" || !user){
        if(Object.keys(accountsData).includes(name)){
            if(accountsData[name].privacy == "public"){
                let result = getPublicProfile("NOT_A_FRIEND",name)
                res.status(200).json(result)
            }
            else{
                res.status(200).json("user is not set to public")
            }
        }
        else{
            res.status(200).json("name does not exist")
        }
    }
    else{
        let publicData = getPublicProfile(user,name)
        let history = getViewableHistoryGames(user,accountsData[name])
        let friendsOfCurrUser = getUser(user).friends.includes(name)
        let friendsOnlyData = {history:history,user:user,friendsOfCurrUser:friendsOfCurrUser}
        let data = Object.assign({},publicData,friendsOnlyData)
        res.render("viewprofile",data)
    }


}
//helper function
//return data on user
function getPublicProfile(user,userB){
    let summary = accountsData[userB].summary
    let active = getViewableActiveGames(user,accountsData[userB])
    let total = summary.total
    let wins = summary.win
    let winPercentage = wins/total*100
    return {name:userB,active:active,winPercentage:winPercentage,total:total,wins:wins}
}
//helper function
//compare user with user 
//return viewable games
function getViewableActiveGames(u,uB){
    let results = []

    uB.active.forEach((id)=>{
        let p = gamesData[id].privacy
        if(p=="friends_only"){
            if(uB.friends.includes(u)){
                results.push(id)
            }
        }
        else if(p=="public"){
            results.push(id)
        }
    })
    return results
}
//helper function
//compare user with user 
//return viewable games
function getViewableHistoryGames(u,uB){
    let results = []
    let len = uB.history.length
    let last5Arr = len<=5 ? uB.history : uB.history.slice(len-5,len)
    last5Arr.forEach((id)=>{
        results.push( {
                "id": id,
                "players":gamesData[id].players,
                "viewable": uB["friends"].includes(u),
                "winner":gamesData[id].result
        })
    })
    return results
}
//return data on user of it exists
function publicSearchUser(req,res){
    let result;
    //check if query exists
    if(Object.keys(req.query).length != 0 ){
        //check if name exists in query
        if(req.query.name){
            result = Object.keys(accountsData).map((name)=>name.toLowerCase()).filter((name)=>name.includes(req.query.name.toLowerCase()))
            res.status(200).json(result)
        }
        else{
            res.status(404).send("error: no param called that")
        }
    }
    else{
        //no specified param
        result = Object.keys(accountsData)
        res.status(200).json(result)
    }
}
//render screen
function renderSpectateGame(req,res){
    let id = req.params.id
    let gameData = gamesData[id]
    let board = JSON.stringify(gameData.history[gameData.history.length-1])
    let players = gameData.players
    let chat = gameData.chat
    let turn = gameData.turn
    let privacy = gameData.privacy
    let spectate = true
    res.render("game",{gameBoard:board,players:players,chat:chat,turn:turn,privacy:privacy,id:id,spectate:spectate})

}
//helper function
//not complete
//supposed to check if user has authorization to see data
//not sure why I made it but it looked important
function hasAuthorization(gameID,user){
    let privacy = getGame(gameID).privacy
    if(privacy == 'private'){
        return 0;
    }
    else{
        if(privacy == 'friends_only'){
            let players = getGame(gameID).players
            let friends = getuser(players[0]).friend.concat(getuser(players[1]).friend)
            if(players.includes(user)){
                return 1;
            }
            if(friends.includes(user)){
                // console.log("user can view game")
                return 1;
            }
            else{
                // console.log("user cannot view game line 323")
                return 0;
            }
        }
    }
}
//user making a friend request
//check if request is good
//respond with data to update with AJAX
function sendFriendReq(req,res){
    let user = req.session.username
    let userB = req.params.name
    if(Object.keys(accountsData).includes(user) && Object.keys(accountsData).includes(userB)){
        accountsData[user].friendReq.push({"name":userB,"status":"sent"})
        accountsData[userB].friendReq.push({"name":user,"status":"received"})
        res.json(accountsData[user].friendReq)
    }
    else{
        res.status(200).send("name not found")
    }
}
//render screen
function renderHowToPlay(req,res){
    res.render("howtoplay")
}
//render screen
function renderSignUp(req,res){
    res.render("signup")
}
//render screen
function renderCreateGameScreen(req,res){
    res.render("creategame")
}
//render screen
function renderMyFriends(req,res){
    let user = req.session.username
    let friendReq = accountsData[user].friendReq
    let allFriends = accountsData[user].friends
    res.render("myfriends",{user:user,friendReq:friendReq,allFriends:allFriends})
}
//render screen
function renderGame(req,res){
    let id = req.params.id
    let gameData = gamesData[id]
    let board = JSON.stringify(gameData.history[gameData.history.length-1])
    let players = gameData.players
    let turn = gameData.turn
    let privacy = gameData.privacy
    res.render("game",{gameBoard:board,players:players,turn:turn,privacy:privacy,id:id})
}
//render screen
function renderMyProfile(req,res){
    let user = req.session.username
    let privacy = accountsData[user].privacy
    res.render("myprofile",{user:user,privacy:privacy})
}
//render screen
function renderMyStats(req,res){
    let user = req.session.username
    let history = accountsData[user].history
    let summary = accountsData[user].summary
    res.render("mystats",{user:user,history:history,summary:summary})
}
//render screen
function renderMyGames(req,res){
    let user = req.session.username
    let active = accountsData[user].active
    res.render("mygames",{user:user,active:active})
}
//render screen
function renderLogin(req,res){
    if(req.session.loggedin){
        let user = req.session.username
        res.render("myprofile",{user:user,privacy:accountsData[user].privacy})
    }
    else{
        res.render("login")
    }
}
//helper function
function getGame(id){
    for(g in gamesData){
        if(g == id){
            return gamesData[g]
        }
    }
}
//user playing a move
//check if the game is good
//check if the move is good
//check if there is winner -> end game, update users
//oherwise make move
//respond with data to update with AJAX
function playMove(req,res,next){
    let user = req.session.username
    let id = req.params.id
    let col = parseInt(req.params.col) - 1  
    let gameData = getGame(id)
    let board = gameData["history"].last()
    let userB = gameData.players.indexOf(user) == 0 ?  gameData.players.slice(1)[0] : gameData.players.slice(0,1)[0]
    let data = {}

    if(gameData.players.indexOf(user) != gameData.turn-1){
        res.status(200).send("not your turn")
    } 
    else if(gameData.result != "na" ){
        res.json({end:true})
    }
    else{
        if(checkMoveValid(col,board)){
            //update board
            //check winner
            let newBoard = updateBoard(col,board,gameData.turn)
            let winStyle = checkWinner(newBoard)
            data = {}
            if(!winStyle){
                gameData.history.push(newBoard)
                gameData.turn = gameData.turn == 1 ? 2 : 1
                gameData.moves.push(col)
                data = {
                    gameBoard:newBoard,
                    turn:gameData.players[gameData.turn - 1],
                    id:id,
                    end:false
                }

            }
            else{
                //update winner
                //remove from active
                //add to history
                gameData.result = user
                gameData.winStyle = winStyle
                removeFromActive(user,userB,id)
                addGameToHistory(user,userB,id)
                data.gameBoard = newBoard
                data.end = true
                data.winStyle = winStyle
            }
            res.json(data)
        }
        else{
            res.status(400).send("move not valid ")
        }
    }
}
//helper function
//create a last() function for array types
//get last item of array
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};
//helper function
//add game to both player's history
function addGameToHistory(u,uB,id){
    accountsData[u].history.push(id)
    accountsData[uB].history.push(id)
}
//helper function
//remove games from both player's active array
function removeFromActive(u,uB,id){
    accountsData[u].active = accountsData[u].active.filter((e)=>e != id)
    accountsData[uB].active = accountsData[uB].active.filter((e)=>e != id)
}
//logout function
//update session
function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
        next()
	}
}

//login function
//check for bad login
//registers with cookie if successful
function login(req, res, next){
    let message;
	if(req.session.loggedin){
        res.render("myprofile",{user:req.session.username,privacy:getUser(req.session.username).privacy})
    }
    else if(req.body && Object.keys(req.body).length > 0){
        let username = req.body.username
        let password = req.body.password
        let found = false;
        for (let user in accountsData){
            if(user == username){
                if (accountsData[user].password == password){
                    req.session.loggedin = true;
                    req.session.username = req.body.username;
                    found=true;
                    res.render("myprofile",{user:req.session.username,privacy:getUser(req.session.username).privacy})
                }
            }
        }
        if(!found){
            message = "Incorrect username or password"
            res.status(401).render("login",{message:message});
        }
    }
    else{
            message = "Not authorized. Invalid password."
            res.status(401).render("login",{message:message});
    }
}
//auth middleware
function auth(req, res, next) {
	if(!req.session.loggedin){
     		return;
    }
	next();
}
//sign up handler
//check if passwords are good
function createUser(req,res,next){
    let username = req.body.username
    let password = req.body.password
    let retypePassword = req.body.retype
    if(password == retypePassword){
        if(!(username in accountsData)){
            accountsData[username] = {
                    "username":username,
                    "password":password,
                    "status": "online",
                    "active": [],
                    "privacy":  "public",
                    "friendReq":[],
                    "friends":[],
                    "summary":{},
                    "history":[]}
            req.session.loggedin = true;
            req.session.username = username
            next()
        }
    }
    else{
        res.status(400).send("Passwords do not match")
    }
}
//user creating game
//check if form is good
//assumption is that a public user is open for games
//create object
//update users
function createGame(req,res,next){
    let user = req.session.username
    let userB = req.body.userB
    let privacy = req.body.privacy
    
    if(!userB || !privacy){
        res.status(400).send("incomplete form")
    }
    else if(!Object.keys(accountsData).includes(userB)){
        res.status(400).send("user does not exist")
    }
    else{
        //make the game, add game to database,update userA active, update userB active
        let uid = String(uuidv4());
        gamesData[uid] = {
            "id":uid,
            "players":[user,userB],
            "chat":[],
            "turn": 1,
            "history":[[
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ]],
            "result":"na",
            "privacy":privacy
        }
        //update users
        accountsData[user].active.push(uid)
        accountsData[userB].active.push(uid)
        res.render("mygames",{user:req.session.username,active:accountsData[user].active})
    }
}
//user presses reject
//respond with array for updating
function rejectRequest(req,res){
    let user = req.session.username
    let userB = req.params.name
    accountsData[user].friendReq = getUser(user).friendReq.filter((obj)=>obj.name!=userB)
    res.json(accountsData[user].friendReq)
}
//user presses remove friend
//respond with array for updating
function removeFriend(req,res){
    let user = req.session.username
    let userB = req.params.name
    //remove friend
    accountsData[user].friends = getUser(user).friends.filter(name => name != userB)
    res.json(accountsData[user].friends)
}
//user presses accept friend
//respond with array for updating
function acceptFriend(req,res){
    let user = req.session.username
    let userB = req.params.name

    //remove userB from user requests
    accountsData[userB].friendReq = getUser(userB).friendReq.filter((name)=>name!=user)
    //remove user from userB requests
    accountsData[user].friendReq = getUser(user).friendReq.filter((obj)=>obj.name!= userB)
    
    //update friends
    accountsData[user].friends.push(userB)
    accountsData[userB].friends.push(user)

    res.status(200).json({
        'friendsArr':getUser(user).friends,
        'friendReqArr':getUser(user).friendReq
    })
}

//take in column number 
//return 1 if move is valid, 0 if move is not valid
function checkMoveValid(col_num, board) {
    if (!board[0][col_num]) {
        for (let i = 9; i >= 0; i--) {
            if (!board[i][col_num])
                return 1;
        }
    } 
    else
        return 0;
}
//take move and board
//return modified board
function updateBoard(c, b, t) {
    for (let i = 9; i >= 0; i--) {
        if (!b[i][c]) {
            b[i][c] = t;
            return b;
        }
    }
}
//take in board state
//return 1 if there is a win, return 0 if no winners
function checkWinner(board) {
    let count = 0;
    let game_row = 10
    let game_col = 8
    for (let i = 0; i < game_col; i++) {
        if (board[0][i] != 0) {
            count++;
        }
    }
    if (count == 8) {
        return null; //draw 
    }
    for (let i = 0; i < game_row; i++) {
        for (let j = 0; j < game_col; j++) {
            try {
                let node = board[i][j];
                if (node != 0) {
                    if (j < 5) {
                        if (board[i][j] == board[i][j + 1] && board[i][j] == board[i][j + 2] && board[i][j] == board[i][j + 3]) {
                            // console.log("win by row");
                            return 1;
                        }
                    }
                    if (i < 7) {
                        if (board[i][j] == board[i + 1][j] && board[i][j] == board[i + 2][j] && board[i][j] == board[i + 3][j]) {
                            // console.log("win by column");
                            return 2;
                        }

                        if (node == board[i + 1][j - 1] && node == board[i + 2][j - 2] && node == board[i + 3][j - 3]) {
                            // console.log("win by diagonal2");
                            return 3;
                        }

                        if (j < 5) {
                            if (node == board[i + 1][j + 1] && node == board[i + 2][j + 2] && node == board[i + 3][j + 3]) {
                                // console.log("win by diagonal1");
                                return 4;
                            }
                        }
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }
    }
    return 0;
}
//user forfeited game
function forfeitGame(req,res){
    let user = req.session.username
    let userB; 
    let id = req.params.id
    //set winner
    if(gamesData[id].players[0] == user){
        userB = gamesData[id].players[1]
    }
    else{
        userB = gamesData[id].players[0]
    }
    gamesData[id].winner = userB

    //remove active user A user B
    //add to history user A user B
    removeFromActive(user,userB,id)
    addGameToHistory(user,userB,id)
    
    //return active games
    res.json(accountsData[user].active)
}
//update privacy of user
function updatePrivacy(req,res,next){
    getUser(req.session.username).privacy = req.body.privacy
    res.render("myprofile")
}
//helper function
function getUser(name){
    for(let u in accountsData){
        if(name == u){
            return accountsData[u]
        }
    }
}