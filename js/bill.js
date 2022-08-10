const apiUtenti = 'http://localhost:3000/utenti';
const apiUtentiFatture = 'http://localhost:3000/fatture';

class Fatture {
    constructor(__fiscalcode, __purpose, __dateofbill, __amount, __piva, __userId, __id) {
        this.fiscalcode = __fiscalcode
        this.purpose = __purpose
        this.dateofbill = __dateofbill
        this.amount = __amount
        this.piva = __piva
        this.userId = __userId
        this.id = __id
        this.bill = document.querySelector('.bill').cloneNode(true)
        this.getBills()
    }


    selectAndWrite(bill, selector, write, headers) {
        let element = bill.querySelector(selector);
        element.textContent = write
        let int = document.createElement('span')
        int.setAttribute("class", "fw-bold")
        int.textContent = headers
        element.prepend(int)
        return element
    }

    getBills() {

        this.getUserName()
        this.selectAndWrite(this.bill, '#billnumber', this.id, 'Bill n°: ')
        this.selectAndWrite(this.bill, '#fiscalcode', this.fiscalcode, 'Fiscal Code: ')
        this.selectAndWrite(this.bill, '#purpose', this.purpose, "Purpose: ")
        this.selectAndWrite(this.bill, '#dateofbill', this.dateofbill, "Date of Bill: ")
        this.selectAndWrite(this.bill, '#amount', this.amount + '$', "Amount: ")
        this.selectAndWrite(this.bill, '#piva', this.piva, "VAT: ")
        let display = document.querySelector('#billContainer')

        this.bill.classList.add('deleatable')//class for letting us to delete the card except for the dummy 
        display.append(this.bill)


    }

    getUserName() {

        fetch(apiUtenti + '/' + this.userId)
            .then(res => res.json())
            .then(dati => {
                let nome = `${dati.firstname + dati.lastname}`
                this.selectAndWrite(this.bill, '#firstname', `${dati.firstname + ' ' + dati.lastname}`, 'Name: ')
            })
    }
}

let arrayDate = []
let arrayPrezzi = []
let totalAmountUser = []
let allUser = []

fetch(apiUtenti)
    .then(res => res.json())
    .then(dati => {
        dati.map(function (i) {
            console.log(dati)
            console.log(i.firstname)
            allUser.push(i.firstname + ' ' + i.lastname)
        })

        console.log(allUser)
        for (let utente of dati) {
            let idUser = utente.id

            fetch(apiUtentiFatture)
                .then(res => res.json())
                .then(allBills => {
                    let userAmount = 0
                    for (let bill of allBills) {
                        if (bill.userId == idUser) {
                            userAmount += parseInt(bill.amount)
                        }
                    }
                    totalAmountUser.push(userAmount)
                })
        }

    }).then(() => creaGrafico ())

console.log(totalAmountUser)

fetch(apiUtentiFatture)
    .then(res => res.json())
    .then(datiFatture => {

        for (let fattura of datiFatture) {
            arrayDate.push(fattura.dateofbill)
            arrayPrezzi.push(fattura.amount)
            let bill = new Fatture(fattura.fiscalcode, fattura.purpose, fattura.dateofbill, fattura.amount, fattura.piva, fattura.userId, fattura.id)
        }
    })



let search = document.querySelector('#searchInput')

search.addEventListener('input', filterBill)

function filterBill() {
    let searchInput = search.value
    let filter = searchInput.toLowerCase()

    let billList = document.querySelectorAll('.deleatable')

    billList.forEach(item => {
        let text = item.textContent

        if (text.toLowerCase().includes(filter)) {
            item.style.display = ''
        }
        else {
            item.style.display = 'none'
        }
    })
}

let orderByDateAmount = document.querySelectorAll('.orderBy')
orderByDateAmount.forEach(item => item.addEventListener('click', order))
let orderByName = document.querySelector('#orderByName')
let btnSearchRange = document.querySelector('#formRange')
btnSearchRange.addEventListener('click', order)


function order() {
    let billList = document.querySelectorAll('.deleatable')
    what = this.dataset.btn
    console.log(this.dataset.btn);
    billList.forEach(item => {
        item.remove()
    })

    fetch(apiUtentiFatture)
        .then(res => res.json())
        .then(datiFatture => {
            function doBills() {
                for (let fattura of datiFatture) {
                    new Fatture(fattura.fiscalcode, fattura.purpose, fattura.dateofbill, fattura.amount, fattura.piva, fattura.userId, fattura.id)
                }
            }
            if (what == 'dateDown') {
                datiFatture.sort(function (a, b) {
                    let dateA = new Date(a.dateofbill);
                    let dateB = new Date(b.dateofbill);
                    return dateA - dateB;
                })
                doBills()
            } else if (what == 'dateUp') {
                datiFatture.sort(function (a, b) {
                    let dateA = new Date(a.dateofbill);
                    let dateB = new Date(b.dateofbill);
                    return dateB - dateA;
                })
                doBills()
            } else if (what == 'amountDown') {
                datiFatture.sort(function (a, b) {
                    return a.amount - b.amount
                })
                doBills()
            } else if (what == 'amountUp') {
                datiFatture.sort(function (a, b) {
                    return b.amount - a.amount
                })
                doBills()
            } else {
                let arrRanges = document.querySelectorAll('.searchRange')
                console.log(arrRanges[0].value, arrRanges[1].value)
                let dateRange = []
                arrRanges.forEach(item => dateRange.push(item.value))//less spaghettiiiiiii
                console.log(dateRange + ' /////////////////////////////////////////////////////////////')
                let sortedRanges = dateRange.sort((a, b) => new Date(a) - new Date(b))

                datiFatture.sort(function (a, b) {
                    let dateA = new Date(a.dateofbill);
                    let dateB = new Date(b.dateofbill);
                    return dateB - dateA
                })

                for (let i of datiFatture) {
                    console.log(sortedRanges + ' dopo il sort ////////////////////////////////////////////////////')
                    console.log(i.dateofbill);
                    let start = sortedRanges[0] /* new Date() */
                    let end = sortedRanges[1] /* new Date() */
                    console.log('start ' + start, 'end ' + end)

                    if (i.dateofbill >= start && i.dateofbill <= end) {
                        console.log(i);
                        new Fatture(i.fiscalcode, i.purpose, i.dateofbill, i.amount, i.piva, i.userId, i.id)
                    }
                } arrRanges = []
            }
            console.log(this.value);
        })
}

let rndnum = [12, 19, 3, 5, 2, 3]
console.log(rndnum)
console.log(arrayDate)
console.log(arrayPrezzi)
console.log(allUser)

function creaGrafico () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const xlables = []
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allUser,
            datasets: [{
                label: 'Sales History',
                data: totalAmountUser,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
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

// provo a fare un graficoo con chartjs

/*() => {
    for(let i of allUser){
        xlables.push(allUser[i])
    }
}
console.log(xlables)

let rndnum = [12, 19, 3, 5, 2, 3]
console.log(rndnum)
console.log(arrayDate)
console.log(arrayPrezzi)


// provo a fare un graficoo con chartjs
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Sales History',
            data: rndnum,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});*/