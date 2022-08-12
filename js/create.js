const apiUtenti = 'http://localhost:3000/utenti';

let button = document.querySelector('#create');


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
            this.profileURL = "img/icons8-batman-vecchio-480.png"
        } else if (document.querySelector('#gender').value == 'Female') {
            this.profileURL = "img/icons8-wonder-woman-480.png"
        } else {
            this.profileURL = "img/icons8-capitan-america-480.png"
        }
    }
}

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
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "content-type": "application/json"
        }
    }

    fetch(apiUtenti, options)//
        .then(res => res.json())
        .then(res => {
            swal({
                icon: 'success',
                title: 'Good job bro a new user has been created!',
                text: `The user ${res.firstname} ${res.lastname} with id: ${res.id} has been created!`,
                showConfirmButton: false,
                timer: 5000
            }).then(() => location.href = 'index.html')
        })

})


