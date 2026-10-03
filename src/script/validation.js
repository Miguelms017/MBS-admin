function validate(){
   let user = document.getElementById('user').value;
   let password = document.getElementById('password').value;

   if (user === 'admin' && password === 'admin'){
        alert("login successfully");
   } else {
        alert("wrong credentials");
   }
}