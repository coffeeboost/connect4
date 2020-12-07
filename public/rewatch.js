game_row = 10
game_col = 8
window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = 0.4 * 10000;
    canvas.height = 0.5 * 10000;
    drawGame(gameBoard)
};
function drawGame(gameBoard){
    canvas = document.getElementById("gameCanvas");
    canvas.width = 0.4 * 10000;
    canvas.height = 0.5 * 10000;
    ctx = canvas.getContext("2d");
    // ctx.fillStyle = "blue";
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

//{id:id, index:index, gameBoard:gameBoard}

// a(id="next" class="button flex-fill text-center" href="javascript:viewMove(\""+id +"\",\""+ index+1 +"\"") next
// a(id="prev" class="button flex-fill text-center" href="javascript:viewMove(\""+id +"\",\""+ index-1 +"\"") prev

// window.onload = function() {
//     canvas = document.getElementById("gameCanvas");
//     canvas.width = 0.4 * 10000;
//     canvas.height = 0.5 * 10000;
    
//     drawGame(gameBoard)
// };

// function drawGame(gameBoard){
//     canvas = document.getElementById("gameCanvas");
//     ctx = canvas.getContext("2d");
//     radius = canvas.width / game_col / 2
//     for (i = 0; i < game_row; i++) {
//         for (j = 0; j < game_col; j++) {
//             let center_y = canvas.height / game_row * i + 0.5 * (canvas.height / game_row);
//             let center_x = canvas.width / game_col * j + 0.5 * (canvas.width / game_col);
//             if (gameBoard[i][j] == 0) {
//                 drawChip(center_x, center_y, radius - 2, "grey", ctx);
//             } else if (gameBoard[i][j] == 1) {
//                 drawChip(center_x, center_y, radius - 2,"red", ctx);
//             } else {
//                 drawChip(center_x, center_y, radius - 2, "green", ctx);
//             }
//         }
//     }  
//     function drawChip(center_x, center_y, radius, color) {
//         ctx.beginPath();
//         ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
//         ctx.fillStyle = color;
//         ctx.fill();
//     } 
// }

// function viewMove(id,index){
//     let req = new XMLHttpRequest();
//     req.onreadystatechange = function(){
//         if (this.readyState == 4 && this.status == 200) {
//             let res = JSON.parse(req.responseText)
//             drawGame(res.gameBoard)
//             // document.getElementById("next").href = `javascript:viewMove(\"${res.id}\",\"${res.index+1}\")`
//             // document.getElementById("prev").href = `javascript:viewMove(\"${res.id}\",\"${res.index-1}\")`
//             // document.getElementById("turn").innerHTML = ""
//             // document.getElementById("turn").innerHTML = res.players[res.turn-1]
//         }
//     }
//     req.open("GET",`/load/${id}/?index=${index}`);
//     req.send();
// }