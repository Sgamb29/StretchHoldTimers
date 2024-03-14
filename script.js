
let firstPress = true;

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
        }, sec * 1000);
    }
}

function refresh() {
    window.location.reload();
}