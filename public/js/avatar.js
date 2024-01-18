async function selectedAvatar(e, avatarName){
        e.preventDefault();
        try{
            console.log("clicked", avatarName);
            const av = {avatar:avatarName};
            const email = e.view.location.pathname.split("/")[3]
            await axios.post(`http://localhost:3000/user/avatar/${email}`, av);
            window.location.href="../login";
        }catch(err){
            console.log(err);
        }
    }

