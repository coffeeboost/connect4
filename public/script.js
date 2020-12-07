//AJAX to server
//sends user input
//server responds with matching names
//handle response
function search(){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    let div = document.getElementById("results")

    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(req.responseText)
      if(res.length==0){
        div.innerHTML = "no users has that name"
      }
      else{
        div.innerHTML = res.join(", ")
      }
    }
    if (this.readyState == 4 && this.status == 404) {
      div.innerHTML = "no users has that name"
    }

  }
  req.open("GET",`/users?name=`+`${document.getElementById("userInput").value}`);
  req.send();
}
//user forfeits game
//send request to server
//if successfull update list
function forfeit(g){
    let req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200) {
        let activeArr = JSON.parse(req.responseText)
        //render active games
        let activeID = document.getElementById("activeID")
        activeID.innerHTML = ""
        let ul = document.createElement('ul')
        activeArr.forEach((gameID)=>{
          let divCard = document.createElement('div')
          let divBody = document.createElement('div')
          let h5 = document.createElement('h5')
          let li = document.createElement('li')
          let br = document.createElement('br')
          let img = document.createElement('img')
          let aForfeit = document.createElement('a')
          let aPlay = document.createElement('a')
          divCard.className = `card`
          divCard.style = 'margin-top:10px;max-width:400px;'
          divBody.className = `card-body`
          h5.className = `card-title`
          li.innerHTML = `game #${gameID}`
          img.src = '/checker-board.png'
          img.alt = `connect 4 board`
          img.style = `width:150px;height:150px;margin-right:10px;`
          aForfeit.className = `btn btn-secondary`
          aForfeit.style = `margin-left:5px;margin-right:5px;`
          aForfeit.href = `javascript:forfeit(\'${gameID}\')`
          aForfeit.innerHTML = 'forfeit'
          aPlay.className = `btn btn-info`
          aPlay.href = `/game/${gameID}`
          aPlay.innerHTML = 'play'
          li.appendChild(br)
          li.appendChild(img)
          li.appendChild(aForfeit)
          li.appendChild(aPlay)
          h5.appendChild(li)
          divBody.appendChild(h5)
          divCard.appendChild(divBody)
          ul.appendChild(divCard)
        })
        activeID.appendChild(ul)
      }
    }
    req.open("PUT",`/forfeit/${g}`);
    req.send();
}
//user accepts friend
//send request to server
//if successfull update list
function acceptFriend(name){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let resFriendReqArr = JSON.parse(req.responseText).friendReqArr
      let resFriendArr = JSON.parse(req.responseText).friendsArr
      updateFriendReqList(resFriendReqArr)
      updateFriendList(resFriendArr)
    }
  }
  req.open("PUT",`/users/${name}`);
  req.send();
}
//user reject friend
//send request to server
//if successfull update list
function rejectFriend(name){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let resFriendReqArr = JSON.parse(req.responseText)
        updateFriendReqList(resFriendReqArr)
      }
  }
  req.open("DELETE","/users/"+name);
  req.send();
}
//user delete friend
//send request to server
//if successfull update list
function deleteFriend(name){
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let friendArr = JSON.parse(req.responseText)
        updateFriendList(friendArr)
       }
  }
  req.open("DELETE","/friend/"+name);
  req.send();
}
//user send a friend request
//send request to server
//if successfull update list
function sendFriend(){ 
  let req = new XMLHttpRequest();
  let input = document.getElementById("sendName").value
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
          if(req.responseText != "name not found"){
            let resFriendReqArr = JSON.parse(req.responseText)
            updateFriendReqList(resFriendReqArr)
            createAlert('alert alert-success','Request was successfully sent')
          }
          else{
            createAlert('alert alert-danger','Request was unsuccessful')
          }
       }
  }
  req.open("PUT",`/friend/${input?input:"NO_USER_INPUT"}`);
  req.send();
}
//helper function
//create alert
//takes class of alert(danger, warning, success etc.) and the message in the alert
//could be exported as module
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
//helper function
//update friend request list
//takes an array
function updateFriendReqList(arr){
   let friendReqID = document.getElementById("friendReqID")
      friendReqID.innerHTML = ""
      let ul = document.createElement("ul")
      arr.forEach((obj)=>{
        let li = document.createElement("li")
        let div = document.createElement("div")
        let img = document.createElement("img")
        let h5 = document.createElement("h5")
        let aView = document.createElement("a")
        let aAccept = document.createElement("a")
        let aReject = document.createElement("a")
        div.style = "display:flex;flex-direction:row;"
        img.src = "/user.png"
        img.alt = "profile pic"
        img.style = "width:20px;height:20px;margin-right:10px;"
        h5.className = "card-text"
        h5.innerHTML = `${obj.name}`
        aView.style = "margin-right:5px;"
        aView.className = "btn btn-info"
        aView.href = `/users/${obj.name}`
        aView.innerHTML = `view`
        div.appendChild(img)
        div.appendChild(h5)
        li.appendChild(div)
        li.appendChild(aView)
        if(obj.status == 'received'){
          aAccept.style = 'margin-right:5px;'
          aAccept.className = `btn btn-success`
          aAccept.href = `javascript:acceptFriend(\'${obj.name}\')`
          aAccept.innerHTML = 'accept'
          aReject.style = 'margin-right:5px;'
          aReject.className = `btn btn-danger`
          aReject.href = `javascript:rejectFriend(\'${obj.name}\')`
          aReject.innerHTML = 'reject'
          li.appendChild(aAccept)
          li.appendChild(aReject)
        }
        ul.appendChild(li)
      })
      friendReqID.appendChild(ul)
}
//helper function
//update friend list
//takes an array
function updateFriendList(arr){
  let friendID = document.getElementById('friendList')
  friendID.innerHTML = ''
  ul = document.createElement("ul")
  arr.forEach((name)=>{
    let li = document.createElement("li")
    let div = document.createElement('div')
    let img = document.createElement("img")
    let h5 = document.createElement("h5")
    let aView = document.createElement("a")
    let aMatch = document.createElement("a")
    let aRemove = document.createElement("a")
    div.style = 'display:flex;flex-direction:row;'
    img.src = '/user.png'
    img.alt = 'profile pic'
    img.style = 'width:20px;height:20px;margin-right:10px;'
    h5.className = 'card-text'
    h5.innerHTML = `${name}`
    aView.style = `margin-right:5px;`
    aView.className = 'btn btn-info'
    aView.href = `/users/${name}`
    aView.innerHTML = `view`
    aMatch.style = `margin-right:5px;`
    aMatch.className = 'btn btn-primary'
    aMatch.href = `/createGame`
    aMatch.innerHTML = `match`
    aRemove.style = `margin-right:5px;`
    aRemove.className = 'btn btn-danger'
    aRemove.href = `javascript:deleteFriend(\'${name}\')`
    aRemove.innerHTML = `remove`
    div.appendChild(img)
    div.appendChild(h5)
    li.appendChild(div)
    li.appendChild(aView)
    li.appendChild(aMatch)
    li.appendChild(aRemove)
    ul.appendChild(li)
  })
  friendID.appendChild(ul)
}