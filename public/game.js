// game_row = 10
// game_col = 8
//periodically update screen information
//handle responses
window.setInterval(function(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(req.responseText)
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
