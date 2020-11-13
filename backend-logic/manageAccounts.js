/**MyStats page 
 * Plan:
 * user goes to /myStats
 * mystats calls getGameHistory, saves the data
 * calls get summary statstics, saves the data
 * call pug, pass in game history and statstics
 * send response with the rendered pug file
*/
function getCurrUserGameHistory(req,res){
    //I think PUG would be calling this route
    /**Pseudocode:
     * get the current user
     * loop through all users in dummyusers
     * if the username matches
     * get the all his finished games
     * return with that information
     */
}
function getSummaryStatisticsInfo(req,res){
    /**Pseudocode:
     * get the current user
     * loop through all users in dummyusers
     * if the username matches
     * get all his summary statistics
     * return with that information
     */
}

/**MyFriends page 
 * Plan:
 * user goes to /myFriends
 * myFriends calls online friends, and save the data
 * then call get all friend requests, and save the data
 * then call get all friends, and save the data
 * the pass all data to myFriends pug
 * return the rendered pug page
*/
function getCurrUserOnlineFriends(req,res){
    /**Psuedocode:
     * get the current user
     * loop through all users in dummy users
     * if the username matches
     * loop through all his friends
     * for every friend
     * loop through the entire users again and find the friend
     * if that friend is online
     * save the friend's username
     * when all loopings are done
     * return the array of names
     */
}

function getCurUserFriendReq(req,res){
    /**Pseudocode:
     * get the current user
     * loop through all the users in dummy users
     * if the username matches
     * return the array names
     */
}

//this is from a button
//URL should look like: /user:A/accept/:userB
function currUserAcceptFriendReq(req,res){
    /**Pseudocode:
     * get the current user and friend user
     * part 1: check that the relationship is valid
     * loop through dummy users and find the current user
     * if user B is in his friend requests
     * then loop through dummy users and find userB
     * if user A is in his sent friend requests
     * part 2:
     * user A remove userB from his friend requests array
     * user A add user B to friends array
     * user B remove user A from his sent friend requests array
     * user B add user A to friends array
     * no return, just update the information
     */
}

//this is from a button
//URL should look like: /user:A/reject/:userB
function currUserRejectFriendReq(req,res){
/**Pseudocode similar to currUserAcceptFriendReq:
 * get the current user and friend user
 * Part 1: check if the relationship is valid
 * part 2: 
 * user A remove user B from friend requests array
 * user B remove user A from sent friend requets array
 * no return, just update the information
 */
}

// function getProfileInfo(req,res){}


function getCurrUserFriends(req,res){}
function getCurrUserActiveGames(req,res){}
function setCurrUserPrivacy(req,res){}
function getCurrUserFriends(req,res){}
function remCurrUserFriend(req,res){}
function getPrev5GamesInfo(req,res){}
function getViewableGames(req,res){}
function getCurrentlyOnline(req,res){}
function searchUser(req,res){}
function currUserSendFriendReq(req,res){}
function getAllUsers(req,res){}
function getSummaryofUser(req,res){}


module.exports = {
    getCurrUserFriends,
    getCurrUserActiveGames,
    getCurrUserGameHistory,
    setCurrUserPrivacy,
    getCurrUserOnlineFriends,
    remCurrUserFriend,
    getSummaryStatisticsInfo,
    getPrev5GamesInfo,
    getViewableGames,
    getCurrentlyOnline,
    searchUser,
    currUserSendFriendReq,
    getAllUsers,
    getSummaryofUser
}