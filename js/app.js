
const api_url = 'http://localhost:3000/utenti'
const display = document.querySelector('#display')


class Carta {
    constructor(__username, __bio, __firstname, __lastname, __gender, __email, __profileURL,__id) {
        this.username = __username;
        this.bio = __bio;
        this.firstname = __firstname;
        this.lastname = __lastname;
        this.gender = __gender;
        this.email = __email;
        this.profileURL = __profileURL;
        this.id = __id;

        this.cardHTML()
    }

    takeClassAndWrite(card, classe, write) {//here we only eat spaghetti  we don't write them
        let element = card.querySelector(classe);//so whe make a method to search and write into HTML
        element.textContent = write
        return element;
    }

    cardHTML() {
        let card = document.querySelector('#cardTemplate .card').cloneNode(true) //here we make the sauce, a card template and with the first method whe write the data collected from the fetch
        console.log(this.username)
        console.log(this.id)
        this.takeClassAndWrite(card, '.card .card-title', `Nickname:  ${this.username}`)
        this.takeClassAndWrite(card, '.card-text', `About me:  ${this.bio}`)
        this.takeClassAndWrite(card, '.card ul > li', `First name:  ${this.firstname}`)
        this.takeClassAndWrite(card, '.card li:nth-child(2)', `Last name:  ${this.lastname}`)
        this.takeClassAndWrite(card, '.card li:nth-child(3)', `Gender:  ${this.gender}`)
        this.takeClassAndWrite(card, '.card li:nth-child(4)', `@email:  ${this.email}`)
        card.querySelector('.card-img-top').src = this.profileURL
        card.querySelector('#modifica').href = `mod.html?id=${this.id}`
        card.querySelector('#elimina').addEventListener('click',()=>{

            swal({
                title: "Are you sure bro?",
                text: "Once deleted, you will not be able to recover this user!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    deleteUser(this.id)
                    swal("Poof! Your ex has been deleted now go get yourself a beer!", {
                    icon: "success",
                  }).then(() => location.href = 'index.html')
                } else {
                    swal("Okok take your time bro forgetting an ex isn't easy at all");
                }
              });              
        })
        display.append(card)
    }
}

fetch(api_url)//make the call
    .then(res => res.json())//get an answer an convert in to json the content
    .then(utenti => {//now i've the data i can do what i want
        console.log(utenti);
        for (let utente of utenti) {
            let card = new Carta(utente.username, utente.bio, utente.firstname, utente.lastname, utente.gender, utente.email, utente.profileURL,utente.id)
        }
    })

//SPAGHETTI MODE TO CREATE A CARD================
/* let userNameBox = card.querySelector('.card .card-title')//gli scrivo il nome utente
                    userNameBox.innerText = `Nickname:  ${this.username}`

                    let firstNameBox = card.querySelector('.card ul > li')
                    firstNameBox.innerText ='Nome: ' + this.firstName

                    let lastNameBox = card.querySelector('.card li:nth-child(2)')
                    lastNameBox.innerText ='Cognome: ' + this.lastName

                    let genderBox = card.querySelector('.card li:nth-child(3)')
                    genderBox.innerText ='Gender: ' + this.gender

                    let emailBox = card.querySelector('.card li:nth-child(4)')
                    emailBox.innerText ='@email: ' + this.email

                    console.log(card)
                    display.append(card) */