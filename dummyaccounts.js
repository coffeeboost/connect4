export default {
    "gordon": {
        "username": "gordon",
        "password": "password",
        "status": "online",
        "active": [1,3],
        "privacy": "pubilc",
        "friendReq": [{
            "name": "bot1",
            "status": "received"
        }, {
            "name": "bot2",
            "status": "sent"
        }],
        "friends": ["bot1", "bot2", "bot3", "bot4"],
        "summary": {"total":10,"win":6},
        "history": []
    },
    "bot1": {
        "username": "bot1",
        "password": "password",
        "privacy": "pubilc",
        "summary": {"total":10,"win":6},
        "active": [1,2,3,4],
        "history": [5,6,7,8],
        "friendReq": [{
            "name": "gordon",
            "status": "sent"
        },{
            "name": "gordon",
            "status": "sent"
        }],
        "friends": ["bot1", "bot2", "bot3", "bot4"]
    },
    "bot2": {
        "username": "bot2",
        "privacy": "private",
        "summary": {"total":10,"win":6},
        "active": [1,2,3,4],
        "history": [5,6,7,8],
        "friends": ["bot1", "bot2", "bot3", "bot4"]},

        
    "bot3": {
        "username": "bot3",
        "privacy": "private",
        "summary": {"total":10,"win":6},
        "active": [1,2,3,4],
        "history": [5,6,7,8]    ,    "friends": ["bot1", "bot2", "bot3", "bot4"]
    },
    "bot4": { "username": "bot4",
         "privacy": "friends_only",
         "summary": {"total":10,"win":6},
         "active": [1,2,3,4],
         "history": [5,6,7,8],        "friends": ["bot1", "bot2", "bot3", "bot4"]
        }
}