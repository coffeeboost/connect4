console.log("deleted")
// let game_row = 10;
// let game_col = 8;
// let gameBoard = [
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0]
// ];
// function gameinit() {
//     let canvas = document.getElementById("gameCanvas");
//     let ctx = canvas.getContext("2d");
//     canvas.width = 0.4 * screen.width;
//     canvas.height = 1.2 * canvas.width;
//     displayGameBoard();

//     for (i = 1; i < game_col + 1; i++) {
//         document.getElementById('but-' + i).addEventListener("click", buttonhandler)
//     }
// }



// function buttonhandler() {
//     let col_num = parseInt(this.name) - 1;
//     if (checkMoveValid(col_num, gameBoard)) {
//         gameBoard = playMove(col_num, gameBoard);
//         turn = turn == 2 ? 1 : 2;
//         //ai turn
//         let ai_move = bestmove(gameBoard);
//         console.log({
//             ai_move
//         })
//         gameBoard = playMove(ai_move, gameBoard);
//         turn = turn == 2 ? 1 : 2;

//         checkWinner(gameBoard);
//         displayGameBoard();
//     }
// }

// //take in column number 
// //return 1 if move is valid, 0 if move is not valid
// function checkMoveValid(col_num, board) {
//     if (!board[0][col_num]) {
//         for (i = 9; i >= 0; i--) {
//             if (!board[i][col_num]) {
//                 return 1;
//             }
//         }
//     } else {
//         return 0;
//     }

// }

// //take in board state
// //return 1 if there is a win, return 0 if no winners
// function checkWinner(board) {
//     let count = 0;
//     for (i = 0; i < game_col; i++) {
//         if (board[0][i] != 0) {
//             count++;
//         }
//     }
//     if (count == 8) {
//         return null; //draw 
//     }
//     for (i = 0; i < game_row; i++) {
//         for (j = 0; j < game_col; j++) {
//             try {
//                 let node = board[i][j];
//                 if (node != 0) {
//                     if (j < 5) {
//                         if (board[i][j] == board[i][j + 1] && board[i][j] == board[i][j + 2] && board[i][j] == board[i][j + 3]) {
//                             console.log("win by row");
//                             return node == 1 ? 1 : 2;
//                         }
//                     }
//                     if (i < 7) {
//                         if (board[i][j] == board[i + 1][j] && board[i][j] == board[i + 2][j] && board[i][j] == board[i + 3][j]) {
//                             console.log("win by column");
//                             return node == 1 ? 1 : 2;
//                         }

//                         if (node == board[i + 1][j - 1] && node == board[i + 2][j - 2] && node == board[i + 3][j - 3]) {
//                             console.log("win by diagonal2");
//                             return node == 1 ? 1 : 2;
//                         }

//                         if (j < 5) {
//                             if (node == board[i + 1][j + 1] && node == board[i + 2][j + 2] && node == board[i + 3][j + 3]) {
//                                 console.log("win by diagonal1");
//                                 return node == 1 ? 1 : 2;
//                             }
//                         }
//                     }
//                 }

//             } catch (err) {
//                 console.log(err);
//             }
//         }
//     }
//     return 0;
// }
