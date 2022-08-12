var checkbox = document.querySelector('input[name=mode]');

checkbox.addEventListener('change', function () {
    if (this.checked) {
        trans()
        document.body.setAttribute('data-theme', 'darkTheme')
    } else {
        trans()
        document.body.setAttribute('data-theme', 'lightTheme')
    }
})

let trans = () => {
    document.body.classList.add('transition');
    window.setTimeout(() => {
        document.body.classList.remove('transition');
    }, 1000)
}
