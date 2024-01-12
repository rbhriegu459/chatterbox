async function createGroup(e){
    e.preventDefault();

    try{
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        const groupName = {group : e.target.groupName.value, admin:decodedToken.userId};
        
        await axios.post('http://localhost:3000/chat/createGroup', groupName,  {headers: {"Authorization":token}});
        window.location.href = 'chat';
    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">Failed Craeting Group ${err.message}</div>`
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