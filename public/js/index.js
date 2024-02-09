// Play btn
// Bron: https://stackoverflow.com/questions/27368778/how-to-toggle-audio-play-pause-with-one-button-or-link
const doodKnop = document.querySelector('#dood-knop');
const doodVideo = document.querySelector('#dood-video');

const kipKnop = document.querySelector('#kip-knop');
const kipVideo = document.querySelector('#kip-video');

let isPlaying1 = false;
doodVideo.classList.add("none")

let isPlaying2 = false;
kipVideo.classList.add("none")

function playVideo1() {
    if (!isPlaying1) {
        doodVideo.classList.remove("none")
        doodVideo.play();
        isPlaying1 = true;
    }
}

function pauseVideo1() {
    if (isPlaying1) {
        doodVideo.classList.add("none")
        doodVideo.pause();
        isPlaying1 = false;
    }
}

function playVideo2() {
    if (!isPlaying2) {
        kipVideo.classList.remove("none")
        kipVideo.play();
        isPlaying2 = true;
    }
}

function pauseVideo2() {
    if (isPlaying2) {
        kipVideo.classList.add("none")
        kipVideo.pause();
        isPlaying2 = false;
    }
}

doodKnop.addEventListener('mouseenter', playVideo1);
doodKnop.addEventListener('mouseleave', pauseVideo1);

kipKnop.addEventListener('mouseenter', playVideo2);
kipKnop.addEventListener('mouseleave', pauseVideo2);
