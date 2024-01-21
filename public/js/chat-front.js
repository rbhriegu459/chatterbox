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
})

window.addEventListener('DOMContentLoaded',async ()=>{
        showGroupsInUi(decodedToken.userId);
        getProfile();
        getContacts();
});

async function getContacts(){
    
    const allUsers = await axios.get("http://localhost:3000/chat/allMembers");

    const ul  =document.getElementById("memberList");
    ul.innerHTML = "";
    const h3 = document.createElement('h3');
    h3.innerHTML = "All Contacts :";
    ul.appendChild(h3);
    allUsers.data.users.forEach(async (user) => {
        if(user.id !== decodedToken.userId){
            const li = document.createElement('li');
            li.innerHTML = user.username;
            li.id = "allContacts";
            ul.appendChild(li);
        }
    })
}

async function getProfile(){
    // -----Avatar-----
    const avatar = document.querySelector('.avatar');
    const getAvatarFromDB= await axios.get(`http://localhost:3000/chat/Avatar/${decodedToken.userId}`);
    const newAvatar= document.createElement('img');
    newAvatar.src = `/images/${getAvatarFromDB.data.getUser.avatar}`
    avatar.appendChild(newAvatar);

    //----Username-----
    const name = await axios.get(`http://localhost:3000/chat/getName/${decodedToken.userId}`);
    const username = document.querySelector('.username');
    const h4 = document.createElement('h4');
    h4.innerHTML = name.data.n.username;
    username.appendChild(h4);
}

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
        document.getElementById("messages").innerHTML = "";
        getChats.data.response.forEach(async (chat) => {
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

async function addChatHeader(groupName){
    const headerDiv = document.getElementById('groupHeader');

        headerDiv.innerHTML =  "";

        const grpNameH3= document.createElement('h3');
        grpNameH3.textContent = groupName;

        const head = document.createElement('div');
        const exitBtn = document.createElement('button');
        exitBtn.id = "exitChat";
        exitBtn.appendChild(document.createTextNode("Exit Chat"));
        exitBtn.addEventListener("click", exitChat);

        const seeMembers = document.createElement('button');
        seeMembers.id = "seeMembers";
        seeMembers.appendChild(document.createTextNode("See Members"));
        seeMembers.addEventListener("click", seeMembersAsList);

        head.appendChild(exitBtn);
        head.appendChild(seeMembers);
        headerDiv.appendChild(grpNameH3);
        
        const admin = await axios.get(`http://localhost:3000/chat/fetchAdmin/${groupName}`);
        if(admin.data.isAdmin === decodedToken.userId){
            const addMember = document.createElement('button');
            addMember.id = "addMember";
            addMember.appendChild(document.createTextNode("Add Member"));
            addMember.addEventListener("click", AddMemberList);
            head.appendChild(addMember);
        }

        headerDiv.appendChild(head);
}

async function seeMembersAsList(e){
    e.preventDefault();
    const activeGroup = localStorage.getItem('activeGroup');

    const allGroupMembers = await axios.get(`http://localhost:3000/chat/allGroupMembers/${activeGroup}`);
    const ul  =document.getElementById("memberList");
    ul.innerHTML = ""
    const h3 = document.createElement('h3');
    h3.innerHTML = "Members :";
    ul.appendChild(h3);
    allGroupMembers.data.userGroups.forEach(async (user) => { 
        const li = document.createElement('li');
        const name = await axios.get(`http://localhost:3000/chat/getName/${user.userId}`);
        li.id = "memberListLi"
        li.innerHTML = name.data.n.username;
        ul.appendChild(li);
    })
}

async function AddMemberList(){
    // document.getElementById('listMembers').style.visibility = "visible";
    
    const allUsers = await axios.get("http://localhost:3000/chat/allMembers");

    const ul  =document.getElementById("memberList");
    ul.innerHTML = ""
    allUsers.data.users.forEach(async (user) => {
        if(user.id !== decodedToken.userId){
            const h3 = document.createElement('h3');
            h3.innerHTML = "Add Members :";
            ul.appendChild(h3);
            const li = document.createElement('li');
            li.innerHTML = user.username;
            li.id = "membersToAdd";
            const addBtn = document.createElement("button");
            addBtn.id= "memberAdded";                
            addBtn.appendChild(document.createTextNode("+ Add"));
            li.appendChild(addBtn);
            ul.appendChild(li);

                // addBtn.addEventListener("click", addMemberToGoup(event, groupName.group, user.id));
                // addBtn.addEventListener("click", async function(e) {
                //     e.preventDefault();
                //     console.log("clicked");
                //     const grpId = await axios.get(`http://localhost:3000/chat/grpId/${groupName.group}`);
                //     const groupDetails = {
                //         groupId:grpId.data.x.id,
                //         isAdmin:false,
                //         userId:user.id
                //     }
                //     await axios.post("http://localhost:3000/chat/addUserToGroup", groupDetails, {headers: {"Authorization":token}})
                //     document.getElementById("memberAdded").style.visibility = "hidden";
                // });
            }
        })
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