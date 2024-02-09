// Bron: https://www.w3schools.com/jsref/met_his_back.asp
const button = document.querySelector(".nav-food button");

function back() {
    history.back()
}
button.addEventListener("click", back);