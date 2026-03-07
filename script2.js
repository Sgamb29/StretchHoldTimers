class Clock {
    intervalId = null;
    displayElement = null;
    msInterval = 1000;
    justSeconds = false;
    needsResume = false;
    currentSetting = null;

    start() {}

    display(sec=0) {
        if (this.displayElement !== null) {
            if (this.justSeconds) {
                this.displayElement.innerText = sec;
            } else {
                this.displayElement.innerText = this.getTimeStr(sec);
            }
        }
    }

    pause() {
        this.needsResume = true;
        this.stop();
    }

    resume() {
        if (this.needsResume) {
            this.start();
            this.needsResume = false;
        } 
    }

    printError() {
        console.error("Can only use one timer at a time (for now)");
    }

    getTimeStr(sec) {
        const mins = parseInt(sec / 60);
        const hrs = parseInt(mins / 60);
        const secs = sec - mins * 60 - hrs * 60 * 60;
        const mStr = mins < 10 ? `0${mins}` : `${mins}`;
        const hStr = hrs < 10 ? `0${hrs}` : `${hrs}`;
        const sStr = secs < 10 ? `0${secs}` : `${secs}`;
        return `${hStr}:${mStr}:${sStr}`;
    
    }

    setDisplayElement(el) {
        this.displayElement = el;
    }

    setUseJustSeconds(bool) {
        this.justSeconds = bool === true ? true : false;
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    reset() {}

    setStartResetPauseResumeButtons(startResetPauseResume=[]) { 
        let count = 1;
        startResetPauseResume.forEach((el) => {
            switch (count) {
                case 1:
                    el.addEventListener("click", () => {this.start() });
                    break;
                case 2:
                    el.addEventListener("click", () => {this.reset() });
                    break;
                case 3:
                    el.addEventListener("click", () => {this.pause() });
                    break;
                case 4:
                    el.addEventListener("click", () => {this.resume() });
                    break;
                default:
                    console.log("count of elements out of bounds.");
                    break;
            }
            count += 1;

        });

    }

}
class Countdown extends Clock {
    countdownSeconds = 0;
    endFunction = null;
    countdownState = null;
    currentSetting = "countdown";

    setEndFunction(func=null) {
        this.endFunction = func;
    }

    setSeconds(sec) {
        this.countdownSeconds = sec;
    }

    start() {
        // if (this.intervalId !== null) {
        //     this.printError();
        //     return;
        // }
        let currentSecs;
        // Resume case
        currentSecs = this.needsResume ? this.countdownState : this.countdownSeconds;
        // 
        this.display(currentSecs);
        this.countDownState = currentSecs;
        this.intervalId = setInterval(() => {
            currentSecs -= 1;
            this.countdownState = currentSecs;
            this.display(currentSecs);
            if (currentSecs <= 0) {
                this.stop();
                if (this.endFunction !== null) {
                    this.endFunction();
                }
            }
        }, this.msInterval);
    }

    reset() {
        this.stop();
        this.countDownState = this.countdownSeconds;
        this.display(this.countdownSeconds);
    }

}
class Tone {

    audioCtx;
    osc;
    sweepEnv;

    initialize() {
        this.audioCtx = new AudioContext();
        this.osc = new OscillatorNode(this.audioCtx);
        this.sweepEnv = new GainNode(this.audioCtx);
    }

    playHighTone() {
        this.playSweep(680);

    }

    playLowTone() {
        this.playSweep(340);

    }

    playSweep(freq) {
        this.initialize(); 
        this.osc.type = "sine";
        this.osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        // this.osc.frequency.setValueAtTime(freq - 50, 0.3);

        this.sweepEnv.gain.setValueAtTime(2, 0);
        // this.sweepEnv.gain.linearRampToValueAtTime(1, .2);
        this.sweepEnv.gain.linearRampToValueAtTime(0, .4);

        this.osc.connect(this.sweepEnv).connect(this.audioCtx.destination)
        this.osc.start(0);
        this.osc.stop(1);
    }
}
const audioToggle = document.getElementById("audioToggle");
let audioEnabled = true;

audioToggle.addEventListener("click", (e) => {
    audioEnabled = audioToggle.checked ? true : false;
})


const holdInput = document.getElementById("holdSec");
const restInput = document.getElementById("restSec");
const setInput = document.getElementById("numSets")
const startBtn = document.getElementById("startButton");
const output = document.getElementById("output");
const indicator = document.getElementById("indicator");

let numSets = 1;
let sequence = [];
let masterSequence = [];
let index = 0;
let totalStreches = 0;
let restSecs = 5;

const timer = new Countdown();
timer.setDisplayElement(output);
timer.setEndFunction(nextStretch);
const tone = new Tone();

let isStretching = false;
let alreadyStarted = false;

function startSequence() {
    if (alreadyStarted) {
        return;
    }
    if (!updateValues()) {
        return;
    }
    timer.setSeconds(restSecs);
    timer.start();
    alreadyStarted = true;
    indicator.innerText = "Get ready.";
}

function resetVariables() {
    alreadyStarted = false;
    isStretching = false;
    index = 0;
    sequence = [];
    masterSequence = [];
}

function nextStretch() {
    if (audioEnabled) {
        tone.playLowTone();

    }
    // Starting a stretch
    if (!isStretching) {
        isStretching = true;
        timer.setSeconds(parseInt(masterSequence[index]));
        timer.start();
        indicator.innerText = `Stretch ${index + 1}/${totalStreches}`;

    } else {
        // Starting a rest - transitiion
        isStretching = false;
        index += 1;
        // Finish sequence case
        if (index === totalStreches) {
            tone.playHighTone();
            indicator.innerText = "Sequence finished.";
            resetVariables();
            return;
        }
        if (restSecs === 0) {
            nextStretch();
        } else {
            timer.setSeconds(restSecs);
            timer.start()
            indicator.innerText = "Rest - Transition.";
        }
    }
}

function isValidSequence(s) {
    let isValid = true;
    s.forEach((i) => {
        if (isNaN(parseInt(i))) {
            isValid = false;
        }
    })
    return isValid;
}

function pause() {
    const pauseButton = document.getElementById("pauseButton");
    if (!alreadyStarted) {
        return;
    }
    if (timer.needsResume) {
        timer.resume();
        pauseButton.innerText = "Pause";
    } else {
        timer.pause();
        pauseButton.innerText = "Resume";
    }
}

function reset() {
    timer.stop();
    resetVariables();
    output.innerText = "Sequence restarted.";
    indicator.innerText = "";
}

function isValidInputs() {

    // Set input checking
    if (isNaN(parseInt(setInput.value))) {
        output.innerText = "Input error: sets input isn't a number.";
        return false;
    } else if (parseInt(setInput.value) <= 0) {
        output.innerText = "Input error: sets can't be 0.";
        return false;
    }

    // Rest input checking
    if (isNaN(parseInt(restInput.value))) {
        output.innerText = "Input error: rest seconds isn't a number.";
        return false;
    } else if (parseInt(restInput.value) < 0) {
        output.innerText = "Input error: rest seconds has to be 0 or more."
        return false;
    }

    // Sequence input checking
    if (holdInput.value === "") {
        output.innerText = "Input error: sequence stretch times empty.";
        return false;
    }

    if (!isValidSequence(sequence)) {
        output.innertext = "Input error: stretch seconds aren't in the right format.";
        return false;
    }

    return true;
}

function updateValues() {
    const sequenceStr = holdInput.value;
    sequence = sequenceStr.split("-");
    if (!isValidInputs()) {
        return false;
    }
    numSets = parseInt(setInput.value);
    restSecs = parseInt(restInput.value);
    generateMaster();
    return true;
}

function generateMaster() {
    for (let i = 0; i < numSets; i++) {
        sequence.forEach((el) => {
            masterSequence.push(el);
        })
    }
    totalStreches = masterSequence.length;
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

// Reset wake lock if navigated away and back.
document.addEventListener("visibilitychange", () => {
    if (screenWake.checked) {
        screenWake.click();
    }
})