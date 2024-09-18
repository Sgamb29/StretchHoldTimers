
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

let colorChangeEnabled = true;

document.getElementById("colorChangeToggle").addEventListener("click", () => {
    colorChangeEnabled = !colorChangeEnabled;
    if (!colorChangeEnabled) {
        document.getElementById("container").style.backgroundColor = "lightgray";
    }
});

// Variables for countdown
let secondsLeft = 0;
let countdownInterval = null;
const countdownOutput = document.getElementById("countdownOutput");


let timeoutId = null;

async function startTimer(sec) {
    let output = document.getElementById("output");
    if (colorChangeEnabled) {
        document.getElementById("container").style.backgroundColor = "pink";
    }
    if (firstPress) {
        firstPress = false;
        let minorsec = sec > 60 ? "Minute" : "Second";
        let minutes = sec > 60 ? sec / 60 : sec;
        output.innerText = `${minutes} ${minorsec} Timer Started - Hold and Breathe.`;

        // Logic for countdown
        secondsLeft = sec;
        countdownOutput.innerText = secondsLeft;

        countdownInterval = setInterval(() => {
            secondsLeft -= 1;
            countdownOutput.innerText = secondsLeft;
        }, 1000);

        // Setting up audioElement for ios
        const audio = new Audio();
        audio.src = currentAudio;
        

        timeoutId = setTimeout(() => {
            output.innerText = "Release.";
            firstPress = true;
            if (audioEnabled) {

                audio.play();
            }

            if (colorChangeEnabled) {
                document.getElementById("container").style.backgroundColor = "lightgreen";
            }

            clearInterval(countdownInterval);
        }, sec * 1000);
    }
}

// function refresh() {
//     window.location.reload();
// }

let extraTimersToggle = document.getElementById("extraTimersToggle");

extraTimersToggle.addEventListener("click", () => {
        const els = document.getElementsByClassName("extraTimer");
        for (let i = 0; i < els.length; i++) {
            els[i].hidden = !els[i].hidden;
        }
        
    
})

function stopAndReset() {
    if (timeoutId !== null) {
        output.innerText = "Release.";
        firstPress = true; 
        if (colorChangeEnabled) {
            document.getElementById("container").style.backgroundColor = "lightgreen";
        }
        countdownOutput.innerText = "";
        clearInterval(countdownInterval);
        clearTimeout(timeoutId);
    }

}


// Wake lock logic

const screenWake = document.getElementById("screenWake");

let isSupported = false;
let wakeLock = null;
const wakeLabel = document.getElementById("wakeLabel");


screenWake.addEventListener("click", async () =>{
    if (screenWake.checked) {
        if ("wakeLock" in navigator) {
            isSupported = true;

            try { 
                wakeLock = await navigator.wakeLock.request("screen");           
                wakeLabel.innerText = "Wake Lock is active!";
              } catch (err) {
                console.log(`${err.name}, ${err.message}`);
                wakeLabel.innerText = "Wake Lock error, might be battery settings."
              }

        } else {
            isSupported = false;
            document.getElementById("wakeLabel").innerText = "Wake Lock Not Supported";
        }
    } else {
        wakeLock.release().then(() => {
            wakeLock = null;
            wakeLabel.innerText = "Keep Screen Awake";
          });
    }
})
