const apiUtenti = 'http://localhost:3000/utenti';

let button = document.querySelector('#create');


class Utente {
    constructor(__username, __bio, __firstname, __lastname, __gender, __email, __profileURL) {
        this.username = __username;
        this.bio = __bio;
        this.firstname = __firstname;
        this.lastname = __lastname;
        this.gender = __gender;
        this.email = __email;
        this.profileURL = __profileURL;
        this.takeForm()

    }
     takeForm(){
    this.username = document.querySelector('#username').value
    this.bio = document.querySelector('#bio').value
    this.firstname = document.querySelector('#firstname').value
    this.lastname = document.querySelector('#lastname').value
    this.gender = document.querySelector('#gender').value
    this.email = document.querySelector('#email').value
    this.checkgender()
}
checkgender(){
    if (document.querySelector('#gender').value == 'Male') {
        this.profileURL= "img/male.png"
    }else if(document.querySelector('#gender').value == 'Female'){
        this.profileURL= "img/female.png" 
    }else{
        this.profileURL= "img/helicopter.png"
    }
}
}

button.addEventListener('click',function(e){
    e.preventDefault();

    let user = new Utente(username, bio, firstname, lastname, gender, email);

    let options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers:{
            "content-type":"application/json"
        }
    }
    
    fetch(apiUtenti,options)//
    .then(res => res.json())
    .then(res => {
        swal({
            position: 'top-end',
            icon: 'success',
            title: 'Good job bro a new user has been created!',
            text:`The user ${res.firstname} ${res.lastname} with id: ${res.id} has been created!`,
            showConfirmButton: false,
            timer: 5000
        }).then(() => location.href = 'index.html')
    })
})