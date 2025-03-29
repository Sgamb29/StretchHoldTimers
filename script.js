let firstPress = true;
let audioToggle = document.getElementById("audioToggle");
let audioEnabled = true;

let chimes = document.getElementById("chimes");
let ducks = document.getElementById("ducks");
let drums = document.getElementById("drums");

let currentAudio = chimes.value;

let audioOpts = [chimes, ducks, drums];

let timerGoOffTime = 0;

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
        document.getElementById("container").style.background = "linear-gradient(45deg, gray, white, gray)";
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
        document.getElementById("container").style.background = "linear-gradient(90deg, pink, white, pink)";
    }
    if (firstPress) {
        firstPress = false;
        let minorsec = sec > 60 ? "Minute" : "Second";
        let minutes = sec > 60 ? sec / 60 : sec;
        output.innerText = `${minutes} ${minorsec} Timer Started - Hold and Breathe.`;

        // Setting up audioElement for ios
        const audio = new Audio();
        audio.src = currentAudio;

        // Logic for countdown
        secondsLeft = sec;
        countdownOutput.innerText = secondsLeft;
        const currentTime = Date.now();
        timerGoOffTime = currentTime + sec * 1000;

        countdownInterval = setInterval(() => {
            const updatedTime = Date.now();
            secondsLeft = (timerGoOffTime - updatedTime) / 1000;
            countdownOutput.innerText = secondsLeft.toFixed(0);
            if (updatedTime >= timerGoOffTime) {

                
                output.innerText = "Release.";
                countdownOutput.innerText = "0";
                firstPress = true;
                if (audioEnabled) {
                    audio.src = currentAudio;
                    audio.play();
                }

                if (colorChangeEnabled) {
                    document.getElementById("container").style.background = "linear-gradient(45deg, green, white, green)";
                }

                clearInterval(countdownInterval);
            }
        }, 1000);

    }
}

let extraTimersToggle = document.getElementById("extraTimersToggle");

extraTimersToggle.addEventListener("click", () => {
        const els = document.getElementsByClassName("extraTimer");
        for (let i = 0; i < els.length; i++) {
            els[i].hidden = !els[i].hidden;
        }
        
    
})

function stopAndReset() {
    if (countdownInterval !== null) {
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

// Cookie and functions required for traffic count (once per day);
let lastFetchCall = "";

document.addEventListener("DOMContentLoaded", () => {
    const lf = getCookie("lastFetch");
    lastFetchCall = lf !== "" ? parseInt(lf) : "";

    makeTrafficCall();
})

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}


function getCookie(name) {
    try {
        const value = document.cookie.split(`${name}=`)[1].split(";")[0];
        return value;
        } catch {
            return "";
        }
}

function makeTrafficCall() {
    // Logic for fetch to only call once per day;
    const time = new Date();
    const DOTW = time.getDay();

  // // Traffic
    const request = new Request("https://server.sgambapps.com/?site=stretch-hold-timers", {
    method: "POST",
});
if (lastFetchCall !== parseInt(DOTW)) {
    fetch(request)
    .then(res => {
        if (res.ok) {
        console.log("visit counted");
        }
    })
    .catch(err => console.log(err));

    setCookie("lastFetch", DOTW.toString(), 10000);
    console.log("cookie set");
    }
}
