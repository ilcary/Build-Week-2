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
        this.selectAndWrite(this.bill, '#amount', this.amount, "Amount: ")
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

fetch(apiUtentiFatture)
    .then(res => res.json())
    .then(datiFatture => {

        for (let fattura of datiFatture) {
            arrayDate.push(fattura.dateofbill)
            arrayPrezzi.push(fattura.amount)
            let bill = new Fatture(fattura.fiscalcode, fattura.purpose, fattura.dateofbill, fattura.amount, fattura.piva, fattura.userId, fattura.id)

        }
    })

console.log(arrayDate, arrayPrezzi)

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
let orderByName = document.querySelector('#orderByName')


orderByDateAmount.forEach(item => item.addEventListener('click', order))

function order() {
    let billList = document.querySelectorAll('.deleatable')
    what = this.textContent
    console.log(this.textContent);
    billList.forEach(item => {
        item.remove()
    })

    fetch(apiUtentiFatture)
        .then(res => res.json())
        .then(datiFatture => {

            if (what == 'Date ⇓') {
                datiFatture.sort(function (a, b) {
                    let dateA = new Date(a.dateofbill);
                    let dateB = new Date(b.dateofbill);
                    return dateA - dateB;
                })
            } else if (what == 'Date ⇑') {
                datiFatture.sort(function (a, b) {
                    let dateA = new Date(a.dateofbill);
                    let dateB = new Date(b.dateofbill);
                    return dateB - dateA;
                })
            } else if (what == 'Amount ⇓') {
                datiFatture.sort(function (a, b) {
                    let ammountA = (a.amount.slice(0, -1)) * 1;
                    let ammountB = (b.amount.slice(0, -1)) * 1;
                    return ammountA - ammountB
                })
            } else {
                console.log('ciao')
                datiFatture.sort(function (a, b) {
                    let ammountA = (a.amount.slice(0, -1)) * 1;
                    let ammountB = (b.amount.slice(0, -1)) * 1;
                    console.log(ammountA)
                    return ammountB - ammountA
                })
            }

            console.log(datiFatture);

            for (let fattura of datiFatture) {
                arrayDate.push(fattura.dateofbill)
                arrayPrezzi.push(fattura.amount)
                let bill = new Fatture(fattura.fiscalcode, fattura.purpose, fattura.dateofbill, fattura.amount, fattura.piva, fattura.userId, fattura.id)

            }
        })


}