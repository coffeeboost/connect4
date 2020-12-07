game_row = 10
game_col = 8

//initialise the canvas for drawing
window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = 0.4 * 10000;
    canvas.height = 0.5 * 10000;
    drawGame(gameBoard)
};
//draw game on a specific DOM element
//takes game Board
function drawGame(gameBoard){
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    radius = canvas.width / game_col / 2
    for (i = 0; i < game_row; i++) {
        for (j = 0; j < game_col; j++) {
            let center_y = canvas.height / game_row * i + 0.5 * (canvas.height / game_row);
            let center_x = canvas.width / game_col * j + 0.5 * (canvas.width / game_col);
            if (gameBoard[i][j] == 0) {
                drawChip(center_x, center_y, radius - 2, "grey", ctx);
            } else if (gameBoard[i][j] == 1) {
                drawChip(center_x, center_y, radius - 2,"red", ctx);
            } else {
                drawChip(center_x, center_y, radius - 2, "green", ctx);
            }
        }
    }  
    function drawChip(center_x, center_y, radius, color) {
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    } 
}
//user makes a move
//AJAX with server
//handle response
//pretty sure turn was never used in my new code
function playMove(id,turn,col){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(req.responseText)
            document.getElementById("turn").innerHTML = res.turn;
            drawGame(res.gameBoard)
        }
    }
    req.open("POST",`/play/${id}/${turn}/${col}`);
    req.send();
}
//copy and pasted, could be exported as module
function createAlert(className,innerHTML){
    let alert = document.getElementById('alert')
    let div = document.createElement('div')
    let but = document.createElement('button')
    let span = document.createElement('span')
    div.className = className + ' alert-dismissible fade show'
    div.role = 'alert'
    div.innerHTML = innerHTML
    but.type = 'button'
    but.className = 'close'
    but.setAttribute('data-dismiss','alert')
    but.setAttribute('aria-label','Close')
    span.setAttribute('aria-hidden','true')
    span.innerHTML = '&times;'
    but.append(span)
    div.append(but)
    alert.appendChild(div)
  }