let params = new URLSearchParams(location.search)
if (!params.has('id')) {
    location.href = 'index.html';
}

let userId = params.get('id');

const apiUtenti = 'http://localhost:3000/utenti';
const apiUtentiFatture = 'http://localhost:3000/utenti/' + userId +'/fatture';



let button = document.querySelector('#creafattura');


fetch(apiUtenti + '/' + userId)
    .then(res => res.json())
    .then(data => {

        document.querySelector('#username').value = data.username
        document.querySelector('#firstname').value = data.firstname
        document.querySelector('#lastname').value = data.lastname
        document.querySelector('#email').value = data.email

    })

class Indirizzo {
    constructor(__address, __country, __city, __zip) {
        this.address = __address
        this.country = __country
        this.city = __city
        this.zip = __zip
        this.getaddress();
    }
    getaddress() {
        this.address = document.querySelector('#address').value
        this.country = document.querySelector('#country').value
        this.city = document.querySelector('#city').value
        this.zip = document.querySelector('#zip').value
    }
}

class Fatture extends Indirizzo {
    constructor(__address, __country, __city, __zip,__username, __firstname, __lastname, __email) {
        super(__username, __firstname, __lastname, __email)
        this.username = __username
        this.firstname = __firstname
        this.lastname = __lastname
        this.email = __email
        this.getIntestazione()
    }
    getIntestazione(){
        this.username = document.querySelector('#username').value
        this.firstname = document.querySelector('#firstname').value
        this.lastname = document.querySelector('#lastname').value
        this.email = document.querySelector('#email').value
    }
}

indirizzoSalvato= localStorage.getItem('indirizzoSalvato') ? JSON.parse(localStorage.getItem('indirizzoSalvato')) : [];


button.addEventListener('click', function (e) {
    e.preventDefault();

    let indirizzoS = new Indirizzo(address, country, city, zip)

    indirizzoSalvato.push(indirizzoS)
    let strindirizzoSalvato = JSON.stringify(indirizzoSalvato)
    localStorage.setItem('indirizzoSalvato',strindirizzoSalvato)

    let fattura = new Fatture(address, country, city, zip, username, firstname, lastname, email);
    console.log(fattura)

    let options = {
        method: 'POST',
        body: JSON.stringify(fattura),
        headers: {
            "content-type": "application/json"
        }
    }

    fetch(apiUtenti+'/'+userId+'?fatture', options)//
        .then(res => res.json())
        .then(res => {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'Order sent!',
                text: `Dear ${res.firstname} ${res.lastname} with id: ${res.id} your order has been correctly sent!`,
                showConfirmButton: false,
                timer: 5000
            })/* .then(() => location.href = 'index.html') */
        })
})
