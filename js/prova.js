const apiUtenti = 'http://localhost:3000/utenti';
const apiUtentiFatture = 'http://localhost:3000/fatture';

let datiUtenti = []

fetch(apiUtenti)
    .then(res => res.json())
    .then(dati => {
        dati.map(function (i) {
            console.log(dati)
            console.log(i.firstname)
            datiUtenti.push(i.firstname + ' ' + i.lastname)
        })
    })

let allUser = []

fetch(apiUtenti)
    .then(res => res.json())
    .then(dati => {
        dati.map(function (i) {
            console.log(dati)
            console.log(i.firstname)
            allUser.push(i.firstname + ' ' + i.lastname)
        })
    })


console.log(allUser)