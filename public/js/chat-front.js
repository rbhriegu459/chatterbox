async function send(e){

    e.preventDefault();
    try{
        const token = localStorage.getItem('token');
        const chatDetails = {
            chat : e.target.msg.value
        };
        const postSend = await axios.post('http://localhost:3000/user/chat', chatDetails, {headers: {"Authorization":token}});
        showChatToUI(chatDetails.chat);

        // document.getElementsByClassName("sendForm").reset();

    }

    catch(err){
        document.body.innerHTML += `<div style="color:red;">Failed Adding chat ${err.message}</div>`
    }
}


async function showChatToUI(chat){

    console.log(chat);

    const addMymsg = document.getElementsByClassName("my-message");

    addMymsg.innerHTML +=   `
        <div>
            <div class="name">YOU</div>
            <div class = "text">${chat}</div>
        </div>
    `

}