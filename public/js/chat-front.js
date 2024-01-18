// ------ WHEN PAGE LOADED ---------
const token = localStorage.getItem('token');
const decodedToken = parseJwt(token);
const socket = io();

// recieve message
socket.on('message', (msg, name) => {
    if(name==="YOU"){
        showChatToUI(msg);
    } else{
        showChatAsOther(msg.chat, name);
    }
    // console.log(msg, name);
})

window.addEventListener('DOMContentLoaded',async ()=>{
        showGroupsInUi(decodedToken.userId);
});

async function showGroupsInUi(userId){
    const res= await axios.get(`http://localhost:3000/chat/fetchGroup/${userId}`);
        res.data.userGroups.forEach(async (group) => {
            const id = group.groupId;
            const x = await axios.get(`http://localhost:3000/chat/fetchGroupName/${id}`);
            const groupNam = x.data.groupName.group;

            const li = document.createElement('li');
            li.id = "groupAddedId"
            li.appendChild(document.createTextNode(groupNam));
            document.getElementById('GroupList').appendChild(li);
            li.addEventListener('click', seeGroupChat);
        });
}

// USING POST REQUEST postChat from chatController -------
async function send(e){
    e.preventDefault();
    try{
        const grpName = localStorage.getItem('activeGroup');
        const chatDetails = {
            chat : e.target.msg.value,
            groupName : grpName
        };
        const postSend = await axios.post('http://localhost:3000/chat/chat', chatDetails, {headers: {"Authorization":token}});
        showChatToUI(chatDetails.chat);
        const name = await axios.get(`http://localhost:3000/chat/getName/${decodedToken.userId}`);
        socket.emit('message', chatDetails, name.data.n.username);
        document.getElementById("sendForm").reset();
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">Failed Adding chat ${err.message}</div>`
    }
}

async function seeGroupChat(e){
    e.preventDefault();
    try{
        const groupName = e.target.innerHTML;
        localStorage.setItem('activeGroup', groupName);
        const getChats =await axios.get(`http://localhost:3000/chat/groupChat/${groupName}`);
        document.getElementById("messages").innerHTML = ""
        console.log(getChats.data.response);
        getChats.data.response.forEach(async (chat) => {
            console.log("chat.userId>>",chat.userId, "decoded userid", decodedToken.userId);
            if(chat.userId === decodedToken.userId){
                showChatToUI(chat.chat);
            } else{
                const name = await axios.get(`http://localhost:3000/chat/getName/${chat.userId}`);
                const username = name.data.n.username
                showChatAsOther(chat.chat, username);
            }
        });

        addChatHeader(groupName);

    }catch(err){
        console.log(err);
    }
}

function addChatHeader(groupName){
    const headerDiv = document.getElementById('groupHeader');

        headerDiv.innerHTML =  "";
        const grpNameH3= document.createElement('h3');
        grpNameH3.textContent = groupName;
        console.log("elements created");

        const exitBtn = document.createElement('button');
        exitBtn.id = "exitChat";
        exitBtn.appendChild(document.createTextNode("Exit Chat"));
        exitBtn.addEventListener("click", exitChat);

        headerDiv.appendChild(grpNameH3);
        headerDiv.appendChild(exitBtn);
}

async function showChatToUI(chat){
    const messageDiv = document.createElement('div');
    const newDivName = document.createElement('div');
    const newDivChat = document.createElement('div');
    messageDiv.className = "message my-message";
    newDivName.className = "name";
    newDivChat.className = "text";

    newDivName.innerHTML += "YOU"
    newDivChat.innerHTML += chat;

    messageDiv.appendChild(newDivName);
    messageDiv.appendChild(newDivChat);
    
    document.getElementById("messages").appendChild(messageDiv);
}

async function showChatAsOther(chat, name){
    const parentMsg = document.getElementById("messages");
    const messageDiv = document.createElement('div');
    const newDivName = document.createElement('div');
    const newDivChat = document.createElement('div');
    messageDiv.className = "message other-message";
    newDivName.className = "name";
    newDivChat.className = "text";

    newDivName.innerHTML += name;
    newDivChat.innerHTML += chat;
    messageDiv.appendChild(newDivName);
    messageDiv.appendChild(newDivChat);
    
    parentMsg.appendChild(messageDiv);
}

// ----Exit Chat Function---
async function exitChat(e){
    e.preventDefault();
    try{
        const activeGroup = localStorage.getItem("activeGroup");
        const response = await axios.get(`http://localhost:3000/chat/exitGroup/${activeGroup}/${decodedToken.userId}`);
        if(response.data.success === true) {
            alert("Left group successfully");
            location.reload();
        }
        console.log("exit");
    }catch(err){
        console.log(err);
    }
}

// ---------- JOin group ----------------

async function joingroup(e){

    e.preventDefault();
    try {
        const joinBtn = document.getElementById('grpJoinId');
        const grpdetails = {
            groupName : joinBtn.parentElement.childNodes.item(0).nodeValue,
            userId : decodedToken.userId
        }
        const joined = await axios.post('http://localhost:3000/chat/joinGroup', grpdetails);
        joinBtn.style.visibility = "hidden";
        alert("Joined Group");
    }
    catch(err){
        console.log(err);
    }
}

//>>>>>>>>>>>> Decoding jwt token >>>>>>>>>>>>>>
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// ----- Adding group -----

async function addGroup(){
    window.location.href = 'addGroup';
}