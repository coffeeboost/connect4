
If your project is making use of modules installed via NPM, 
you should not include your node_modules folder in the 
submission zip. Instead, provide the required NPM resources 
to automate the installation of required modules using 
the npm install command.

Gordon Tang 101158226
1. What project you are working on
- Connect 4
3. Instructions that specify how to setup, run, and test your server
- npm install
- npm start
4. A description of the files the TA should look at to evaluate your business logic code
- created dummy data in an external file
- (in game-logic-module.js)
- are functions which do the following:
    - accept friend request
    - send friend request
    - get all currently online people
    - game code (but it's work in progress)
    - create new game object
    - create new user object 
    - edit user profile 
- (in expressServer.js)
    - is the server code
    - which handles GET and POST and lots of comments that you can ignore
- (in package.json)
    - are the npm rules are put in here
- (in ./public)
    - are my css and js files
- (in ./views)
    - are my PUG files

5. A description of additional expectations
    - PUG files (described dynamic interaction below)
    - AJAX on login page (described below)
    - Express (self explanatory)
    - No REST :(

Commentary on Base Expectations:
- I used Express instead of vaniall JS because we'd be using Express eventually so why not start early
- You would notice that my screens are really empty, that's because I'm in the process of revamping them. Project Checkin #1 dealt with the functionality component so I was hoping I would focus my attention on other parts but I just haven't integrated the two parts together. Hope that's okay.


Where to Focus for Grading:
- Focus on nav bar
- Focus on login page which you get to by / or /login or pressing logout in nav bar
- enter some data in the two fields
- press login 
- (PUG dynamic tempalting)
- you will notice that your data is on the top right of the screen in red 
- open terminal or where you can see console.log
- (My AJAX interaction)
- you will notice that I showed how a new user was added to the json in the game-logic-module.js 


Commentary on HINTS AND TIPS:
- JSON file is separated and required in game-logic-module.js
- every object has a unique ID (an interator at the top of js)
- Game objects in user objects are referred to by their game ID
- completely ignored sessions
- currentlyOnline() is an example of using public/friends/private
- I had a requesting user variable inside functions when I need usernames
