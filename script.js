
let firstPress = true;
let audioToggle = document.getElementById("audioToggle");
let audioEnabled = true;

let chimes = document.getElementById("chimes");
let ducks = document.getElementById("ducks");
let drums = document.getElementById("drums");

let currentAudio = chimes.value;

let audioOpts = [chimes, ducks, drums];


for (opt of audioOpts) {
    opt.addEventListener("click", (e) => {
        currentAudio = e.target.value;
    })
}

let optionsDiv = document.getElementById("audioField");


audioToggle.addEventListener("click", (e) => {
    audioEnabled = audioToggle.checked ? true : false;
    optionsDiv.hidden = !optionsDiv.hidden;
})

async function startTimer(sec) {
    let output = document.getElementById("output");
    if (firstPress) {
        firstPress = false;
        let minorsec = sec > 60 ? "Minute" : "Second";
        let minutes = sec > 60 ? sec / 60 : sec;
        output.innerText = `${minutes} ${minorsec} Timer Started - Hold and Breathe.`;
        setTimeout(() => {
            output.innerText = "Release.";
            firstPress = true;
            if (audioEnabled) {
                let player = new Audio(currentAudio);
                player.play()
            }
        }, sec * 1000);
    }
}

function refresh() {
    window.location.reload();
}