Gordon Tang 101158226

1. What project you are working on
- Connect 4, working alone.

2. A Sumary of any extensions you have added to your system
- I made the app mobile friendly (most apparent on game screen)

3. A Summary of any design decision to increase the quality of your system
NOTE:
- I'm sorry for putting javascript directly inside of PUG
- Try manually refreshing the page after you do something, my reloading have 
    been inconsistent. I have a work around, in that you can set timeout a page 
    refresh if you include ./components/reload in the header of a pug file. But 
    that method makes the website looks like it has a seizure.
- Don't press enter when searching. Instead press the submit button. (need to fix)
- I'd say I'm missing 4 functions, better CSS, and a database. But otherwise... I should be good.


HAVE DONE
In terms of backend:
- REST routes for most operations with proper AJAX for most operations
- dynamically create page with PUG
- make use of express
- make use of express session
- can log in multiple users
- make use of async functions, by using next() after auth
- make use of efficient method by using filter HOC method
- broke up logic into many functions which are intuitive to read 
- I have a lot of functions (600 lines of code) but they are called as needed. 

In terms of REST:
- intuitive naming scheme
- used params 
- group up functions based on which screens they appear in
- call functions from a top down approach

In terms of front end:
- the app is responsive
- the layout is intuitive
- leveraged Bootstrap

HAVE NOT DONE 
hate to see it but...
- chat
    - currently game screen only displays information and the game board but you cannot chat nor see a chat
- spectate
    - currently view game button does not let you spectate a game
- watch game replay
    - does not exist
- send friend request
    - does not exist

Point-by-point comparison with base expectations of checkin 3:
1. incorporate express (yes)
2. add sessions (yes)
3. finalise deisgn of REST (yes)
4. connect express to business logic with approproate responses (yes)
5  supporting almost all the functions (yes) (missing spectate game, chat, watch game replay)


Point-by-point comparison with the assignment specification:
1 search for user (yes)
2. send friend request (yes)
3. see and accept/reject those requests (yes)
4. see which friends are online and offline (yes)
5. viewing friend's profile (yes)
6. removing friends (yes)
7. set profile to public/private (yes)
8. view their current active games and navigate to game (yes)
9.1 create game with random person (yes)
9.2 create game with friend (yes)
9.3 set privacy of game (yes)
10.1 view history of games (yes)
10.2 watch the game play out again (no)

-under viewing a user profile
1. see summary statistic (yes)
2. see summary of last 5 games (yes)
3. see current active games (yes)

-under playing games
1. see current active games (yes)
2. continue playing game (yes)
3. easily whose turn it is (yes)
4. forfeit game (yes)
5. chat system (no)
6. observe game (no)

-under REST API
1. GET /users (yes)
2. GET /users/:user (yes)
3. GET /games (no) (unable to get data on active public games)


4. OpenStack information and Instructions
public IP is: 134.117.130.233
username is: student@134.117.130.233
password is: topsecretpassword

instructions to launch and test the website:
connect to Carleton's VPN, then
in the terminal, type:
ssh student@134.117.130.233
login in with password:
topsecretpassword
(now you have connected to OpenStack on my account)

in the same terminal, type:
cd connect4
node expressServer.js
(this starts my server and in case of failure, go to this terminal,
 press control + c to stop all terminal operations, then type 
 node expressServer.js again)

connect to the ssh tunnel in another terminal, type:
ssh -L 9999:localhost:3000 student@134.117.130.233
login in with password:
topsecretpassword
(this creates the tunnel which, I think, connects the internal port 3000 
to a public port of 9000)

access the website in a browser window at http://localhost:9999

