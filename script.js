
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




// async function autoplaySequence(index) {
//     let mainImage = document.getElementById("mainImage");
//     let output = document.getElementById("output");
//     let btn = document.getElementById("autoPlayStartButton");

//     btn.disabled = true;
//     const sequence = [
//         {
//             "img": "assets/photos/pexels-elina-fairytale-3822191.jpg",
//             "time": 10,
//             "text": "Seated Forward Fold 60 Seconds"
//         },
//         {
//             "img": "assets/photos/pexels-miriam-alonso-7592479.jpg",
//             "time": 10,
//             "text": "Butterfly Pose 60 Seconds"
//         },
//         {
//             "img": "assets/photos/pexels-ketut-subiyanto-4436298.jpg",
//             "time": 5,
//             "text": "One-Leg Forward Bend Left 30 Seconds",
//         },
//         {
//             "img": "assets/photos/pexels-ketut-subiyanto-4436298.jpg",
//             "time": 5,
//             "text": "SWITCH! One-Leg Forward Bend Right 30 Seconds",
//         },
//     ];

//     btn.innerText = "Autoplay Started"
//     mainImage.src = sequence[index]["img"];
//     output.innerText = sequence[index]["text"];
//     let lastTime = sequence[index]["time"];


//     let intervalId = setInterval(() => {
//         if (audioEnabled) {
//             let player = new Audio("assets/drum-sound.mp3");
//             player.play()
//         }
//         index += 1;
//         if (index < sequence.length) {
//             let currentTime = sequence[index]["time"];
//             checkTimeDifference(intervalId, lastTime, currentTime, index);

//         } else {
//             output.innerText = "Sequence Finished!";
//             btn.innerText = "Start Autoplay";
//             index = 0;
//             clearInterval(intervalId);
//             btn.disabled = false;
//             return;
//         }
//         mainImage.src = sequence[index]["img"];
//         output.innerText = sequence[index]["text"];

//         lastTime = sequence[index]["time"];
        
        
//     }, sequence[index]["time"] * 1000);


        
// }

// function checkTimeDifference(iid, lastTime, currentTime, index) {
//     if (lastTime != currentTime) {
//         clearInterval(iid);
//         autoplaySequence(index);

//     }
// }
