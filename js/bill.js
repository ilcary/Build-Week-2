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

async function getData() {
    /*  let utenti = await fetch(apiUtenti).then(res => res.json())
     let fatture = await fetch(apiUtentiFatture).then(res => res.json()) */
    let [utenti, fatture] = await Promise.all([fetch(apiUtenti).then(res => res.json()), fetch(apiUtentiFatture).then(res => res.json())])
    console.log(utenti, fatture);
    let yeartotalamount = []
    let sketchYears = fatture.map((i) => i.dateofbill.slice(0,-6)).sort((a,b) => a-b) // take date from bill and then we slice day and month value and we order them 
    let years = [...new Set(sketchYears)] //(Set is a collection of unique values.) the new Set will implicitly remove duplicate elements 
    console.log(years)
    years.forEach(anno => {
        let yearAmount = 0
        for (let fattura of fatture) {  
            if (fattura.dateofbill.slice(0,-6) == anno) {
                yearAmount += parseInt(fattura.amount)
            }
        }
        yeartotalamount.push(yearAmount)
    });
    for (let fattura of fatture) {
        new Fatture(fattura.fiscalcode, fattura.purpose, fattura.dateofbill, fattura.amount, fattura.piva, fattura.userId, fattura.id)

    }

    creaGrafico(years, yeartotalamount)

    /* let allUser = utenti.map((i) => i.firstname + ' ' + i.lastname)

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
    creaGrafico(allUser, totalAmountUser) */
}

getData()

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

//selecting all the buttons that let the user sort the bill list 
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

function creaGrafico(dataX, dataY) {
    document.querySelector('#chartContainer').classList.remove('d-none');
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataX,
            datasets: [{
                label: 'Company Sales History',
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

                borderWidth: 1
            }]
        },
        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });

}
