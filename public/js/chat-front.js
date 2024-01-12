async function send(e){

    e.preventDefault();
    try{
        const token = localStorage.getItem('token');
        const chatDetails = {
            chat : e.target.msg.value
        };

        const postSend = await axios.post('http://localhost:3000/chat/chat', chatDetails, {headers: {"Authorization":token}});
        showChatToUI(chatDetails.chat);

        document.getElementById("sendForm").reset();
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">Failed Adding chat ${err.message}</div>`
    }
}


async function showChatToUI(chat){
    const addMymsg = document.getElementById('my-message');
    
    addMymsg.innerHTML +=   `
        <div>
            <div class="name">YOU</div>
            <div class = "text">${chat}</div>
        </div>
    `
}

async function showChatAsOther(chat, name){
    const addMymsg = document.getElementById('other-message');
    // const addMymsg = document.getElementsByClassName('messages');

    addMymsg.innerHTML +=   `
        <div>
            <div class="name">${name}</div>
            <div class = "text">${chat}</div>
        </div>
    `
}

// ------ WHEN PAGE LOADED ---------

window.addEventListener('DOMContentLoaded',async ()=>{
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    
    const response = await axios.get('http://localhost:3000/chat/fetchChat', {headers: {"Authorization":token}})
        response.data.chatsFromDb.forEach(async (chat) =>{
            if(chat.userId === decodedToken.userId){
                showChatToUI(chat.chat);
            }
            else{
                const userId = chat.userId;
                const name = await axios.get(`http://localhost:3000/chat/getName/${userId}`);
                showChatAsOther(chat.chat, name.data.n.username);
            }
        });
});

//>>>>>>>>>>>> Decoding jwt token >>>>>>>>>>>>>>
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}