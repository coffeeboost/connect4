game_row = 10
game_col = 8
window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = 0.4 * 10000;
    canvas.height = 0.5 * 10000;
    
    drawGame(gameBoard)
};

window.setInterval(function(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(req.responseText)
            // console.log(res)
            if(res.end){
                let alert = document.getElementById("alert")
                alert.innerHTML = ""

                switch(res.winStyle){
                    case 1:
                        createAlert("alert alert-success",`${res.result} won by row`)
                        break;
                    case 2:
                        createAlert("alert alert-success",`${res.result} won by column`)
                        break;
                    case 3:
                        createAlert("alert alert-success",`${res.result} won by diagonal`)
                        break;
                    case 4:
                        createAlert("alert alert-success",`${res.result} won by diagonal`)
                    default:
                        createAlert("alert alert-success",`${res.result} won`)
                }
                drawGame(res.gameBoard)
                document.getElementById("turn").innerHTML = ""
                document.getElementById("turn").innerHTML = res.result
   
            }
            else{
                drawGame(res.gameBoard)
                document.getElementById("turn").innerHTML = ""
                document.getElementById("turn").innerHTML = res.players[res.turn-1]
       
            }
        }
    }
    req.open("GET",`/load/${document.getElementById("gameid").innerHTML}/`);
    req.setRequestHeader("Accept","application/json")
    req.send();
},1000)

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
function playMove(id,turn,col){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(req.responseText)
            // console.log(res)

            document.getElementById("turn").innerHTML = res.turn;
            drawGame(res.gameBoard)
            // if(res.end){
            //     let alert = document.getElementById("alert")
            //     let div = document.createElement("div")
            //     div.className = "alert alert-success"
            //     div.role = "alert"
            //     div.innerHTML = "Game over"
            //     alert.appendChild(div)
            // }
            // else{
            // }
        }
    }
    req.open("POST",`/play/${id}/${turn}/${col}`);
    req.send();
}
// {gameBoard:board,players:players,chat:chat,turn:turn,privacy:privacy,id:id}

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