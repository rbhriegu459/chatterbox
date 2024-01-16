const token = localStorage.getItem('token');
const decodedToken = parseJwt(token);

async function createGroup(e){
    e.preventDefault();
    alert("Group created");
    window.location.href = "chat";
}

async function addMembers(e){
    e.preventDefault();

    try{
        const groupName = {group : e.target.groupName.value, admin:decodedToken.userId};
        await axios.post('http://localhost:3000/chat/createGroup', groupName,  {headers: {"Authorization":token}});

        document.getElementById("memberBox").style.visibility = "visible";
        const allUsers = await axios.get("http://localhost:3000/chat/allMembers");

        allUsers.data.users.forEach(async (user) => {
            if(user.id !== decodedToken.userId){
                const ul  =document.getElementById("memberList");

                ul.innerHTML = "";
                const li = document.createElement('li');
                li.innerHTML = user.username;
                const addBtn = document.createElement("button");
                addBtn.id= "memberAdded";
                addBtn.appendChild(document.createTextNode("+ Add"));
                li.appendChild(addBtn);
                ul.appendChild(li);

                // addBtn.addEventListener("click", addMemberToGoup(event, groupName.group, user.id));
                addBtn.addEventListener("click", async function(e) {
                    e.preventDefault();
                    console.log("clicked");
                    const grpId = await axios.get(`http://localhost:3000/chat/grpId/${groupName.group}`);
                    const groupDetails = {
                        groupId:grpId.data.x.id,
                        isAdmin:false,
                        userId:user.id
                    }
                    await axios.post("http://localhost:3000/chat/addUserToGroup", groupDetails, {headers: {"Authorization":token}})
                    document.getElementById("memberAdded").style.visibility = "hidden";
                });
            }
        })
    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">Failed Creating Group ${err.message}</div>`
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