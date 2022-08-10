const apiUtenti = 'http://localhost:3000/utenti';

let params = new URLSearchParams(location.search)
if (!params.has('id')) {
    location.href = 'index.html';
}

let userId = params.get('id');
let button = document.querySelector('#update');

class Utente {
    constructor(__username, __btd, __firstname, __lastname, __gender, __email, __profileURL) {
        this.username = __username;
        this.btd = __btd;
        this.firstname = __firstname;
        this.lastname = __lastname;
        this.gender = __gender;
        this.email = __email;
        this.profileURL = __profileURL;
        this.takeForm()

    }
    takeForm() {
        this.username = document.querySelector('#username').value
        this.btd = document.querySelector('#btd').value
        this.firstname = document.querySelector('#firstname').value
        this.lastname = document.querySelector('#lastname').value
        this.gender = document.querySelector('#gender').value
        this.email = document.querySelector('#email').value
        this.checkgender()
    }
    checkgender() {
        if (document.querySelector('#gender').value == 'Male') {
            this.profileURL = "img/male.png"
        } else if (document.querySelector('#gender').value == 'Female') {
            this.profileURL = "img/female.png"
        } else {
            this.profileURL = "img/helicopter.png"
        }
    }
}

fetch(apiUtenti + '/' + userId)
    .then(res => res.json())
    .then(data => {

        this.username = document.querySelector('#username').value = data.username
        this.btd = document.querySelector('#btd').value = data.btd
        this.firstname = document.querySelector('#firstname').value = data.firstname
        this.lastname = document.querySelector('#lastname').value = data.lastname
        this.gender = document.querySelector('#gender').value = data.gender
        this.email = document.querySelector('#email').value = data.email

    })


function validate(form) {
    console.log(form)

    if (form.username.value == "") {
        swal({
            icon: 'error',
            title: 'Oops...',
            text: "Please provide your Nickname!",
        })
        form.username.focus();
        return false;
    }
    if (form.dateofbirth.value == "") {
        swal({
            icon: 'error',
            title: 'Oops...',
            text: "Please provide your date of birth!",
        })
        form.dateofbirth.focus();
        return false;
    }
    if (form.firstname.value == "") {
        swal({
            icon: 'error',
            title: 'Oops...',
            text: "Please provide your first name!",
        })
        form.firstname.focus();
        return false;
    }
    if (form.lastname.value == "") {
        swal({
            icon: 'error',
            title: 'Oops...',
            text: "Please provide your last name!",
        })
        form.lastname.focus();
        return false;
    }
    var emailID = form.email.value;
    atpos = emailID.indexOf("@");
    dotpos = emailID.lastIndexOf(".");
    if (atpos < 1 || (dotpos - atpos < 2)) {
        swal({
            icon: 'error',
            title: 'Oops...',
            text: "Please enter correct email",
        })
        form.email.focus();
        return false;
    }
    return (true);
}

button.addEventListener('click', function (e) {
    e.preventDefault();

    if (!(validate(creazioneUtente)))
        return

    let user = new Utente(username, btd, firstname, lastname, gender, email);

    let options = {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            "content-type": "application/json"
        }
    }

    fetch(apiUtenti + '/' + userId, options)//
        .then(res => res.json())
        .then(res => {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'User updated!',
                text: `The user ${res.firstname} ${res.lastname} with id: ${res.id} has been correctly updated!`,
                showConfirmButton: false,
                timer: 5000
            }).then(() => location.href = 'index.html')
        })
})
