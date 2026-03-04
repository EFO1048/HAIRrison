document.addEventListener("DOMContentLoaded", () => {
    // needed to separate these because btn is out of the dom
    const connectBtn = document.getElementById("connectBtn")
    if (connectBtn) {
        connectBtn.addEventListener("click", testConnection);
    }

    // radio buttons for state by state or full
    document.getElementById("fullWalkthrough").addEventListener("click",disableStateStart);
    document.getElementById("stateByState").addEventListener("click", enableStateStart);

    // full start and stop
    document.getElementById("fullStart").addEventListener("click", function(event){
        stateStart(event, 1)
    });

    document.getElementById("fullStop").addEventListener("click", function(event){
        stateStart(event, 1)
    });

    // state buttons
    document.getElementById("state1").addEventListener("click", function(event){
        stateStart(event, 1)
    });
    document.getElementById("state2").addEventListener("click", function(event){
        stateStart(event, 2)
    });
    document.getElementById("state3").addEventListener("click", function(event){
        stateStart(event, 3)
    });
    document.getElementById("state4").addEventListener("click", function(event){
        stateStart(event, 4)
    });
});

// enable all of the state by state buttons 
// disable start and stop but they'd be re-enabled once
// you choose a state later on
function enableStateStart() {
    // enable state buttons
    const stateBtns = document.getElementsByClassName("stateBtn");
    for (let i = 0; i < 4; i++) {
        stateBtns[i].disabled = false;
    }

    // disable the start and stop
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");

    startBtn.disabled = true;
    stopBtn.disabled = true;
}

// disable all of the state buttons
function disableStateStart() {
    // re-enable full btns by default
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");

    startBtn.disabled = false;
    stopBtn.disabled = false;

    const stateBtns = document.getElementsByClassName("stateBtn");
    for (let i = 0; i < 4; i++) {
        stateBtns[i].disabled = true;
    }
}

async function stateStart(stateNum) {
    


}

async function testConnection() {
    const button = document.getElementById("connectBtn");
    const contButton = document.getElementById("continueBtn");
    const status = document.getElementById("status");

    button.disabled = true;
    status.innerText = "Connecting...";

    // show progress bar
    showSpinner();

    const response = await fetch("/connect", {
        method: "POST"
    });

    const data = await response.json();
    hideSpinner();

    if (data.message !== "Connection Successful!") {
        button.innerText = "Retry";
        status.innerText = "Error, please try again";
        button.disabled = false;
    } else {
        status.innerText = data.message;
        button.style.display = "none";
        contButton.style.display = "block";
    }
}

// Show progress bar while loading
function showSpinner() {
    document.getElementById("connSpinner").style.display = "block";
}

// Hide after we are done
function hideSpinner() {
    document.getElementById("connSpinner").style.display = "none";
}

// Continue to main page
function continueOn() {
    window.location.href = "/continueOn";
}

// PROGRESS BAR AND TIMERS
function startProgress() {

}

function startTimer() {
    
}