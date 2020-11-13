/*function below are for the myGames page*/
function getAllInprogressGames (req,res){
/** Pseudocode:
 * Route should look like: GET: /user:A/getCurrentGames
 * from dummy games data:
 * loop through all the items:
 * get games that are public or the player's friends matches my username 
 */
}
//there is a button route that goes to the form page first
//then this function takes form data and create game object
function createGame (req,res){
    /**PseudoCode:
     *  There should be 2 forms on the client side, one to search for player and one for matchmaking settings
     * The logic is to collect data on the client side then send the data to this route
     * Route should look like: POST: /user:A/create/user:B/{settings}
     * Part 1:
     * Create game json object from incoming data
     * generate a unique id
     * push new object to the dummy games data
     * Part 2:
     * add game id to the players's object
     * loop through all users from dummy accounts
     * if name matches, then add the game id to their current active games
     */
}


//req.query //query parameters are here
//URL: on the client side
//on client side
//create local var for player, active and detail
//create URL string: "/games?player=" + player 
// is /games?player=__&active=True&detail=___
//{
    // player: 

//}
function getChat(req,res){}
function getBoardState (req,res){}
function getGameInfo (req,res){}
function updateBoardState (req,res){}
function getChat (req,res){}
function sendMessage (req,res){}

module.exports = {
    // getAllActiveGames,
    getBoardState,
    getGameInfo,
    updateBoardState,
    createGame,
    getChat,
    sendMessage
}