async function signup(e){
    try{
        e.preventDefault();

        const signupDetails = {
            username: e.target.username.value,
            email:e.target.email.value,
            phonenum:e.target.number.value,
            password:e.target.password.value
        }

        const response = await axios.post("http://localhost:3000/user/signup", signupDetails)
        if(response.status === 204){
            alert("Successfully Signed up!")
            window.location.href = "login";
        } else{
            alert("User email id already exists, Please Login!");
        }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err}</div>`
    }
}


async function login(e){
    e.preventDefault();
    try{
        const loginDetails = {
            email:e.target.email.value,
            password:e.target.password.value
        }

        // console.log(loginDetails);

        const response = await axios.post("http://localhost:3000/user/login", loginDetails)                    
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        window.location.href ="chat";
    }
    catch(err){
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">Login Failed ${err.message}</div>`
    }
}