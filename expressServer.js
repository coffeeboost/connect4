import { v4 as uuidv4 } from 'uuid'
import express from "express";
import session from 'express-session'
import accountsData from "./dummyaccounts.js"
import gamesData from "./dummygames.js"


const app = express() //set up server

app.use(session({secret: 'codingdefined', resave: false, saveUninitialized: true}));


app.set('view engine', 'pug') //set up pug

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
//suggested middleware
app.use(function(req,res,next){
    console.log("-------------------------");
    console.log("Request Method: "+ req.method);
    console.log("Request URL: "+ req.url);
    console.log("Request PATH: "+ req.path);
    console.log("Request Session: " + req.session);
    console.log(req.session)
    console.log();
    next();
});
const port=3000
app.listen(port, () => {console.log(`app listening at http://localhost:${port}`)})

//REST API
//render screen routes
app.get("/", renderLogin)

app.post("/login", login, auth, renderMyGames)
app.post("/logout",logout,renderLogin)
app.route("/signup").get(renderSignUp).post(createUser,auth,renderMyProfile)

//page routes
app.get("/myfriends",auth,renderMyFriends)
app.get("/mystats",auth,renderMyStats)
app.get("/myprofile",auth,renderMyProfile)
app.get("/mygames", auth, renderMyGames)
app.get("/howtoplay",(req,res,next)=>{res.render("howtoplay")});

//myfriends functions
app.get("/viewProfile/:userB",auth,renderViewProfile)
// app.put("/accept/:userB",auth,acceptFriend,renderMyFriends)
// app.delete("/remove/:userB",auth,removeFriend,renderMyFriends)
// app.delete("/reject/:userB",auth,rejectRequest,renderMyFriends)
app.put("/accept/:userB",auth,acceptFriend)
app.delete("/remove/:userB",auth,removeFriend)
app.delete("/reject/:userB",auth,rejectRequest)


//game functions
app.get("/game/:id", auth,renderGame)
app.post("/play/:id/:turn/:col",auth,playMove)
app.route("/creategame",auth).get(renderCreateGameScreen).post(createGame)
app.put("/forfeit/:id",auth,forfeitGame)

app.post("/search2",searchForResults,renderCreateGameScreen)
app.post("/search",searchForResults,renderMyFriends)

//app.get("/user/:query", u)
/**
 * ajax request
 * get request to users/:id, handle (DOM manipulate)
 * 
 */

//myprofile functions
app.post("profilePrivacy", auth, updatePrivacy,renderMyProfile)


function forfeitGame(req,res){
    let user = req.session.username
    let userB; 
    let id = req.params.id
    //set winner
    for(let g in gamesData){
        if(id == g){
            let winner = gamesData[g].players.indexOf(user) == 0 ?  gamesData[g].players.slice(1)[0] : gamesData[g].players.slice(0,1)[0]
            userB = winner
            gamesData[g].result = winner
            console.log(winner)

            break
        }
    }
    console.log(userB)

    //remove active user A user B
    //add to history user A user B
    removeFromActive(user,userB,id)
    addGameToHistory(user,userB,id)
    
    //return active games
    console.log(accountsData[user].active)
    res.status(200).send(JSON.stringify(accountsData[user].active))
}
function updatePrivacy(req,res,next){
    for(let u in accountsData){
        if(u == req.session.username){
            accountsData[u].privacy = req.body.privacy
            next()
        }    
    }
}
function renderSignUp(req,res){
    res.render("signup")
}
function renderViewProfile(req,res){
    let user = req.session.username
    let userB = req.params.userB
    let data = getUserBSummary(user,userB)
    console.log({data})
    res.render("viewprofile",{user:user,userB:userB,summary:data.summary,
                            active:data.active,history:data.history})
}
function renderCreateGameScreen(req,res,){
    let results = res.locals.results
    if(results){
        res.render("creategame",{searchResults:results})
    }
    else{
        res.render("creategame")
    }
}
function searchForResults(req,res,next){
    res.locals.results = getSearchResults(req.body.input)
    next()
}
function renderMyFriends(req,res){
    let user = req.session.username
    let friendReq = getFriendReq(user)
    let allFriends = getAllFriends(user)  
    if(res.locals.results){
        let results = res.locals.results
        res.render("myfriends",{user:user,friendReq:friendReq,allFriends:allFriends,searchResults:results})
    }
    else{  
        res.render("myfriends",{user:user,friendReq:friendReq,allFriends:allFriends})
    }
}
function renderGame(req,res){
    // let user = req.session.username
    let id = req.params.id
    let gameData = getGameData(id)
    let board = JSON.stringify(gameData.history[gameData.history.length-1])
    let players = gameData.players
    let chat = gameData.chat
    let turn = gameData.turn
    let privacy = gameData.privacy
    res.render("game",{gameBoard:board,players:players,chat:chat,turn:turn,privacy:privacy,id:id})
}
function renderMyProfile(req,res){
    let user = req.session.username
    let privacy = getPrivacy(user)
    res.render("mystats",{user:user,privacy:privacy})


}
function renderMyStats(req,res){
    let user = req.session.username
    let history = getGameHistory(user)
    res.render("mystats",{user:user,history:history})


}
function renderMyGames(req,res){
    let user = req.session.username
    let active = getActive(user)
    res.render("mygames",{user:user,active:active})
}
function renderLogin(req,res){
    res.render("login")

}
function playMove(req,res,next){
    let user = req.session.username
    let id = req.params.id
    let gameData = getGameData(id)
    let turn = parseInt(req.params.turn)
    let col = parseInt(req.params.col) - 1  
    let board = gameData.history[gameData.history.length-1]
    let userB = gamesData[id].players.indexOf(user) == 0 ?  gamesData[id].players.slice(1)[0] : gamesData[id].players.slice(0,1)[0]
    
    //check if it is current session user's turn
    if(gameData.players.indexOf(user) != turn-1){
        res.stats(400).send("not your turn bitch")
    } 
    else{
        console.log("your turn")
        if(checkMoveValid(col,board)){
            //update board
            //check winner
            let newBoard = updateBoard(col,board,turn)
            let data = {}
            if(!checkWinner(newBoard)){
                gameData.history.push(newBoard)
                gameData.turn = turn == 1 ? 2 : 1

                data["gameBoard"] = newBoard
                data["turn"] = gameData.players[gameData.turn - 1]
                data["id"] = id
            }
            else{
                console.log("winer")
                //update winner
                //remove from active
                //add to history
                for(let g in gamesData){
                    if(id == g){
                        gamesData[g].result = user
                    }
                }
                removeFromActive(user,userB,id)
                addGameToHistory(user,userB,id)
                //go back to game screen *
                data["end"] = true
            }
            res.status(200).send(JSON.stringify(data))
        }
        res.stats(400).send("move not valid dumbass")
    }
}
function addGameToHistory(u,uB,id){
    accountsData[u].history.push(id)
    accountsData[uB].history.push(id)
}
function removeFromActive(u,uB,id){
    for(let person in accountsData){
        if(u == person || uB == person){
            accountsData[u].active = accountsData[u].active.filter((e)=>e != id)
        }
    }
}
function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
        next()
	}
}
function login(req, res, next){
	if(req.session.loggedin){
        console.log("already logged in")
        next();
    }
    else if(req.body){
        let username = req.body.username
        let password = req.body.password
        for (let user in accountsData){
            if(user == username){
                if (accountsData[user].password == password){
                    req.session.loggedin = true;
                    req.session.username = req.body.username;
                    next();
                }
            }
        }
    }
    else{
        res.status(401).send("Not authorized. Invalid password.");
    }
}
function auth(req, res, next) {
	if(!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}
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
        res.status(400).send("Passwords do not match") //409 user exists
    }
}
function createGame(req,res){
    let user = req.session.username
    let userB = req.body.userB
    let privacy = req.body.privacy
    
    if(!userB || !privacy){
        res.status(400).send("incomplete form")
    }else{
        //make the game, add game to database,update userA active, update userB active
        let uid = uuidv4();
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
    }

    res.status(200).send("ok")
}
function rejectRequest(req,res,next){
    let user = req.session.username
    let userB = req.params.userB
    let len = accountsData[user].friendReq.length
    for(let i =0;i < len;i++ ){
        if(userB == accountsData[user].friendReq[i].name && "received"==accountsData[user].friendReq[i].status){
            accountsData[user].friendReq.splice(i,i+1)
            break;
        }
    }
    next()
}
function removeFriend(req,res,next){
    let user = req.session.username
    let userB = req.params.userB
    //remove friend
    let len = accountsData[user].friends.len
    for(let i =0;i < len;i++ ){
        if(userB == accountsData[user].friends){
            accountsData[user].friends.splice(i,i+1)
            return accountsData[user].friends
        }
    }
}
function acceptFriend(req,res,next){
    let user = req.session.username
    let userB = req.params.userB
    //remove userB from user requests
    let len = accountsData[user].friendReq.length
    for(let i =0;i < len;i++ ){
        if(userB == accountsData[user].friendReq[i].name){
            accountsData[user].friendReq.splice(i,i+1)
            break;
        }
    }
    //remove user from userB requests
    len = accountsData[userB].friendReq.length
    for(let i =0;i < len;i++ ){
        if(user == accountsData[userB].friendReq[i].name && "sent" == accountsData[userB].friendReq[i].status){
            accountsData[userB].friendReq.splice(i,i+1)
            break;
        }
    }
    accountsData[user].friends.push(userB)
    accountsData[userB].friends.push(user)
    res.status(200).send(JSON.stringify({"friendsArr":accountsData[user].friends,"friendReqArr":accountsData[user].friendReq})) 
}
function getPrivacy(u){
    for(let user in accountsData){
        if (u==user){
            u = accountsData[user]
            return u.privacy
        }
    }
}
function getGameHistory(u){
    for(let user in accountsData){
        if (u==user){
            u = accountsData[user]
            return u.history
        }
    }
}
function getActive(u){
    for(let user in accountsData){
        if (u==user){
            u = accountsData[user]
            return u.active
        }
    }
}
function getFriendReq(u){
    for(let user in accountsData){
        if (u==user){
            u = accountsData[user]
            return u.friendReq
        }
    }
}
function getAllFriends(u){
    for(let user in accountsData){
        if (u==user){
            u = accountsData[user]
            return u.friends
        }
    }
}
function getSearchResults(i){
    let results = []
    for(let user in accountsData){
        if (user.includes(i)){
            results.push(user)
        }
    }
    return results;
}
function getUserBSummary(currUser,uB){
    let result = {}

    for(let user in accountsData){
        if (uB==user){
            uB = accountsData[user]
            result["summary"] = uB.summary
            result["active"] = getViewableActiveGames(currUser,uB)
            result["history"] = getMoreInfoOnLast5Game(currUser,uB)
            return result
        }
    }
}
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
function getMoreInfoOnLast5Game(u,uB){
    let results = []

    let len = uB.history.length
    let last5Arr = len<=5 ? uB.history : uB.history.slice(len-5,len)
    last5Arr.forEach((value)=>{
        for(let g in gamesData){
            if(value == g){
                results.push( {"id": g,
                        "players":gamesData[g].players,
                        "viewable": uB["friends"].includes(u),
                        "winner":gamesData[g].result
                })
            }
        }
    })
    return results
}
function getGameData(id){
    for(let g in gamesData){
        if(id == g){
            return gamesData[g]
        }
    }
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
                            console.log("win by row");
                            return node == 1 ? 1 : 2;
                        }
                    }
                    if (i < 7) {
                        if (board[i][j] == board[i + 1][j] && board[i][j] == board[i + 2][j] && board[i][j] == board[i + 3][j]) {
                            console.log("win by column");
                            return node == 1 ? 1 : 2;
                        }

                        if (node == board[i + 1][j - 1] && node == board[i + 2][j - 2] && node == board[i + 3][j - 3]) {
                            console.log("win by diagonal2");
                            return node == 1 ? 1 : 2;
                        }

                        if (j < 5) {
                            if (node == board[i + 1][j + 1] && node == board[i + 2][j + 2] && node == board[i + 3][j + 3]) {
                                console.log("win by diagonal1");
                                return node == 1 ? 1 : 2;
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