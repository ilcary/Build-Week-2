let checkbox = document.querySelector('input[name=mode]');
let checked = localStorage.getItem('nightmode') ? JSON.parse(localStorage.getItem('nightmode')) : [];
checkbox.checked = checked
function checknighton(){
    if (checkbox.checked) {
        /* trans() */
        document.body.setAttribute('data-theme', 'darkTheme')
    } else {
        /* trans() */
        document.body.setAttribute('data-theme', 'lightTheme')
    }
    localStorage.setItem('nightmode', checkbox.checked)
}
window.onload= checknighton();
checkbox.addEventListener('change',checknighton)


let trans = () => {
    document.body.classList.add('transition');
    window.setTimeout(() => {
        document.body.classList.remove('transition');
    }, 1000)
}
