
const api_url = 'http://localhost:3000/utenti'
const apiUtentiFatture = 'http://localhost:3000/fatture';
const display = document.querySelector('#display')


async function getData() {
    /*  let utenti = await fetch(apiUtenti).then(res => res.json())
     let fatture = await fetch(apiUtentiFatture).then(res => res.json()) */
    let [utenti, fatture] = await Promise.all([fetch(apiUtenti).then(res => res.json()), fetch(apiUtentiFatture).then(res => res.json())])
    console.log(utenti, fatture);

    let allUser = utenti.map((i) => i.firstname + ' ' + i.lastname)

    fatture = fatture.map((f) => {
        let user = utenti.find((u) => u.id == f.userId)
        f['user'] = user
        return f
    })
    console.log(fatture);

    let totalAmountUser = []
    for (let utente of utenti) {
        let idUser = utente.id
        let userAmount = 0
        for (let bill of fatture) {
            if (bill.userId == idUser) {
                userAmount += parseInt(bill.amount)
            }
        }
        totalAmountUser.push(userAmount)
    }
    creaGrafico(allUser, totalAmountUser)
}

getData()

function creaGrafico(dataX, dataY) {
    document.querySelector('#chartContainer').classList.remove('d-none');
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataX,
            datasets: [{
                label: 'Users Sales History',
                data: dataY,
                backgroundColor: [
                    'rgba(214, 104, 83, 0.7)',
                    'rgba(125, 78, 87, 0.7)',
                    'rgba(140, 153, 176, 0.7)',
                ],
                borderColor: [
                    'rgba(214, 104, 83, 1)',
                    'rgba(125, 78, 87, 1)',
                    'rgba(140, 153, 176, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}


class Carta {
    constructor(__username, __btd, __firstname, __lastname, __gender, __email, __profileURL, __id) {
        this.username = __username;
        this.btd = __btd;
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
        this.takeClassAndWrite(card, '.card ul > li', `First name:  ${this.firstname}`)
        this.takeClassAndWrite(card, '.card li:nth-child(2)', `Last name:  ${this.lastname}`)
        this.takeClassAndWrite(card, '.card li:nth-child(3)', `Gender:  ${this.gender}`)
        this.takeClassAndWrite(card, '.card li:nth-child(4)', `@email:  ${this.email}`)
        this.takeClassAndWrite(card, '.card li:nth-child(5)', `Birthday:  ${this.btd}`)
        card.querySelector('.card-img-top').src = this.profileURL
        card.querySelector('#modifica').href = `mod.html?id=${this.id}`
        card.querySelector('#fattura').href = `creafattura.html?id=${this.id}`
        card.querySelector('#elimina').addEventListener('click', () => {

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
            let card = new Carta(utente.username, utente.btd, utente.firstname, utente.lastname, utente.gender, utente.email, utente.profileURL, utente.id)
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