
let audioToggle = document.getElementById("audioToggle");
let audioEnabled = true;

audioToggle.addEventListener("click", (e) => {
    audioEnabled = audioToggle.checked ? true : false;
})


let four = document.getElementById("fourMinute");
let eight = document.getElementById("eightMinute");

let lengthOpts = [four, eight];
let currentLength = 4;

for (opt of lengthOpts) {
    opt.addEventListener("click", (e) => {
        currentLength = parseInt(e.target.value);
    })
}

let accumulatedTime = 0;

async function autoplaySequence(index) {
    let mainImage = document.getElementById("mainImage");
    let output = document.getElementById("output");
    let btn = document.getElementById("autoPlayStartButton");
    let photographer = document.getElementById("photographer");

    btn.disabled = true;
    const sequence = [
        {
            "img": "assets/photos/pexels-elina-fairytale-3822191.jpg",
            "time": 10,
            "text": "Seated Forward Fold 60 Seconds",
            "by": "Photo by Elina Fairytale",
        },
        {
            "img": "assets/photos/pexels-miriam-alonso-7592479.jpg",
            "time": 10,
            "text": "Butterfly Pose 60 Seconds",
            "by": "Photo by Miriam Alonso",
        },
        {
            "img": "assets/photos/pexels-ketut-subiyanto-4436298.jpg",
            "time": 5,
            "text": "One-Leg Forward Bend Left 30 Seconds",
            "by": "Photo by Ketut Subiyanto"
        },
        {
            "img": "assets/photos/pexels-ketut-subiyanto-4436298.jpg",
            "time": 5,
            "text": "SWITCH! One-Leg Forward Bend Right 30 Seconds",
            "by": "Photo by Ketut Subiyanto",
        },
        {
            "img": "assets/photos/pexels-vlada-karpovich-4534689.jpg",
            "time": 10,
            "text": "Downward Dog 60 Seconds",
            "by": "Photo by Vlada Karpovich",
        },
        {
            "img": "assets/photos/pexels-marta-wave-6453939.jpg",
            "time": 5,
            "text": "Low Lunge 30 Seconds",
            "by": "Photo by Marta Wave",
        },
        {
            "img": "assets/photos/pexels-marta-wave-6453939.jpg",
            "time": 5,
            "text": "SWITCH! Low Lunge, Other leg, 30 Seconds",
            "by": "Photo by Marta Wave",
        },
        {
            "img": "assets/photos/pexels-elina-fairytale-3822088.jpg",
            "time": 10,
            "text": "Standing Forward Fold 60 Seconds",
            "by": "Photo by Elina Fairytale",
        },
        {
            "img": "assets/photos/pexels-rfstudio-3820430.jpg",
            "time": 10,
            "text": "Reach for the Sky 60 seconds",
            "by": "Photo by RF Studio",
        },
        {
            "img": "assets/photos/pexels-marta-wave-6454068.jpg",
            "time": 10,
            "text": "Wide Legged Forward Fold 60 seconds",
            "by": "Photo by Marta Wave",
        },
    ];

    endingImage = {
        "img": "assets/photos/pexels-mikhail-nilov-6707077.jpg",
        "time": 10,
        "text": "Session Finished!",
        "by": "Photo by Mikhail Nilov",
    }

    // Button is pressed, starting image / data is loaded

    btn.innerText = "Autoplay Started"
    mainImage.src = sequence[index]["img"];
    output.innerText = sequence[index]["text"];
    photographer.innerText = sequence[index]["by"];
    let lastTime = sequence[index]["time"];




    let intervalId = setInterval(() => {
        if (audioEnabled) {
            let player = new Audio("assets/drum-sound.mp3");
            player.play()
        }
        accumulatedTime += sequence[index]["time"];
        console.log(accumulatedTime);

        index += 1;
        if (index < sequence.length & accumulatedTime < currentLength * 10) {
            let currentTime = sequence[index]["time"];
            checkTimeDifference(intervalId, lastTime, currentTime, index);

        } else {
            output.innerText = "Sequence Finished!";
            mainImage.src = endingImage["img"];
            photographer.innerText = endingImage["by"];
            btn.innerText = "Start Autoplay";
            index = 0;
            clearInterval(intervalId);
            btn.disabled = false;

            accumulatedTime = 0;

            return;
        }
        mainImage.src = sequence[index]["img"];
        output.innerText = sequence[index]["text"];
        photographer.innerText = sequence[index]["by"];


        lastTime = sequence[index]["time"];
        
        
        
    }, sequence[index]["time"] * 1000);


        
}

function checkTimeDifference(iid, lastTime, currentTime, index) {
    if (lastTime != currentTime) {
        clearInterval(iid);
        autoplaySequence(index);

    }
}
