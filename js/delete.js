const apiUtenti = 'http://localhost:3000/utenti';

let options = {
    method: 'DELETE',
    headers: {
        "content-type": "application/json"
    }
}

function deleteUser(id){
    fetch(apiUtenti+'/'+id, options)
    .then(res=>res.json())
    .then(res=>{
       
    })
}