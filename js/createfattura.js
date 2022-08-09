
let params = new URLSearchParams(location.search)
if (!params.has('id')) {
    location.href = 'index.html';
}

let userId = params.get('id');

const apiUtenti = 'http://localhost:3000/utenti';
const apiUtentiFatture = 'http://localhost:3000/fatture';

let button = document.querySelector('#creafattura');




fetch(apiUtenti + '/' + userId)
    .then(res => res.json())
    .then(data => {

        document.querySelector('#username').value = data.username
        document.querySelector('#firstname').value = data.firstname
        document.querySelector('#lastname').value = data.lastname
        document.querySelector('#email').value = data.email
        document.querySelector('#btd').value = data.btd
        document.querySelector('#amount').value = Math.floor(Math.random() * 10000) + ' $'

    })

/*
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
*/

class Fatture {
    constructor(__fiscalcode, __purpose, __dateofbill, __amount, __piva, __userId) {
        this.fiscalcode = __fiscalcode
        this.purpose = __purpose
        this.dateofbill = __dateofbill
        this.amount = __amount
        this.piva = __piva
        this.userId = __userId
        this.getIntestazione()
    }


    getIntestazione() {
        this.fiscalcode = document.querySelector('#fiscalcode').value
        this.purpose = document.querySelector('#purpose').value
        this.dateofbill = document.querySelector('#dateofbill').value
        this.amount = document.querySelector('#amount').value
        this.piva = document.querySelector('#piva').value
    }

}

//AGGIUNGI PREZZO////////////////////////////////////////

button.addEventListener('click', function (e) {
    e.preventDefault();

    let fattura = new Fatture(fiscalcode, purpose, dateofbill, amount, piva, userId);
    console.log(fattura)

    let options = {
        method: 'POST',
        body: JSON.stringify(fattura),
        headers: {
            "content-type": "application/json"
        }
    }

    fetch(apiUtentiFatture, options)//
        .then(res => res.json())
        .then(res => {
            swal({
                position: 'top-end',
                icon: 'success',
                title: 'Order sent!',
                text: `Dear ${res.firstname} ${res.lastname} with id: ${res.id} your order for ${res.purpose} has been correctly sent!`,
                showConfirmButton: false,
                timer: 6000
            }).then(() => location.href = 'index.html')
        })
})
