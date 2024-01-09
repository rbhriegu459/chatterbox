async function signup(e){
    try{
        e.preventDefault();

        const signupDetails = {
            username: e.target.username.value,
            email:e.target.email.value,
            password:e.target.password.value
        }

        const response = await axios.post("http://localhost:3000/user/signup", signupDetails)
        if(response.status === 204){
            window.location.href = "login";
        } else{
            throw new Error("User email id already exists") ;
        }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
    }
}