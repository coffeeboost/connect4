let accountsData = require("./dummyaccounts.json"); //load initial accounts
let gamesData = require("./dummygames.json"); //load initial games
let numberofAccounts = 7; //unique accountid for json
let gameId = 7; //unique gameid for json


function rejectFriendRequest() {

}

function manageVariousAspectsOfAccounts(){

}

/**************** */


function acceptFriendRequest() {
    let requestingUser = {
        "username": "current user"
    }
    let incomingInformation = {
        "username": "friend in friendlist",
    }
    for (uid in accounts) {
        if (accounts[uid].username == requestingUser.username) {
            accounts[uid].friends.push(incomingInformation.username) //add friend
            delete accounts[uid].received_friend_req.incomingInformation.username //remove from requests
        }
        if (accounts[uid].username == incomingInformation.username) { //action for other user
            accounts[uid].friends.push(requestingUser.username)
            delete accounts[uid].sent_friend_req.requestingUser.username
        }
    }
}

function sendFriendRequest() {
    let requestingUser = {
        "username": "current user"
    }
    let incomingFriendRequest = {
        "username": "potential friend",
    }

    for (uid in accounts) {
        if (accounts[uid].username == requestingUser.username) {
            accounts[uid].sent_friend_req[incomingFriendRequest.username] = "sent";
        }
        if (accounts[uid].username == incomingFriendRequest.username) {
            accounts[uid].username.received_friend_req[requestingUser.username] = "nothing";
        }
    }
}

//allow for 1. Search for other users to form a friendship with.
function getUsernames() {
    let usernameList = []
    for (user in accounts) {
        usernameList.push(accounts[user].username)
    }
    return usernameList
}

function currentlyOnline() {
    let onlineList = []
    let requestingUser = {
        "username": "current user"
    }
    for (user in accounts) {
        if (accounts[user].online == "online") {
            if (accounts[user].privacy == "public") {
                onlineList.push(accounts[user].username);
            } else if (accounts[user].privacy == "friends-only") {
                if (accounts[user].friends.includes(requestingUser.username)) {
                    onlineList.push(accounts[user].username);
                }
            }
        }
    }
    return onlineList;
}

function createNewGame() {
    let incomingInfo = {
        "players": ["one", "two"],
        "privacy": "public"
    }
    let gameObject = {
        "players": incomingInfo.players,
        "winner": "nothing",
        "turn": incomingInfo.players[0],
        "privacy": incomingInfo.privacy,
        "moves": []
    }
    games[gameId + 1] = gameObject;
    gameId++;
}

function editProfile() {
    let incomingChanges = { //possible changes : password, privacy
        "username": "gordon",
        "password": "b",
        "privacy": "c",
    }

    if (doesUserExist(incomingChanges.username)) {
        for (item in accounts) {
            if (accounts[item].username == incomingUserName) {
                accounts[item].password = incomingChanges.password;
                accounts[item].privacy = incomingChanges.privacy;
                console.log("profile changes for ${incomingChanges.username} are made");
            }
        }
    }
}

function doesUserExist(incomingNametoCheck) {
    for (item in accounts) {
        if (accounts[item].username == incomingNametoCheck) {
            return false;
        }
    }
    // console.log(`${incomingNametoCheck} user does exist`)
    return true;
}

function createUser(incomingData) {
    console.log(incomingData)
    // console.log(incomingPassword)
    let incomingUsername = "3333"
    let incomingPassword = "fgf"

    console.log(`User json before new person ${Object.keys(accounts)}`)
    if (doesUserExist(incomingUsername)) {
        let newUser = {
            "username": incomingUsername,
            "password": incomingPassword,
            "privacy": "public",
            "online": "online",
            "summary": {
                "games_played": 0,
                "wins": 0,
                "win_percent": 0,
                "last_5_games": []
            },
            "friends": [],
            "games": [],
            "sent_friend_req": {},
            "received_friend_req": {}
        }
        accounts[numberofAccounts + 1] = newUser;
        numberofAccounts++;
    }
    console.log(`User json after new person ${Object.keys(accounts)}`)

}



module.exports = {
    accounts,
    games,
    createUser
    // getUsers
}