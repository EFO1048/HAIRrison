// DUMMY TEST DATA FOR LATER:
const estimateData = {
    time: {
        fullWalkthrough: "2:10",
        state1: "1:00",
        state2: "0:35",
        state3: "0:47",
        state4: "1:00",
    },
    measurements: {
        sensor1: 100,
        sensor2: 50,
    },
};
// fetch estimate data

document.addEventListener("DOMContentLoaded", () => {

    // needed to separate these because btn is out of the dom
    const connectBtn = document.getElementById("connectBtn");
    if (connectBtn) {
        connectBtn.addEventListener("click", testConnection);
    }

    // radio buttons for state by state or full
    document
        .getElementById("fullWalkthrough")
        .addEventListener("click", disableStateStart);
    document
        .getElementById("stateByState")
        .addEventListener("click", enableStateStart);

    // full start and stop
    document
        .getElementById("fullStart")
        .addEventListener("click", function (event) {
            fullStart();
        });

    document
        .getElementById("fullStop")
        .addEventListener("click", function (event) {
            fullStop();
        });

    // state buttons
    document
        .getElementById("state1")
        .addEventListener("click", function (event) {
            selectState(this);
            stateStart(event, 1);
        });
    document
        .getElementById("state2")
        .addEventListener("click", function (event) {
            selectState(this);
            stateStart(event, 2);
        });
    document
        .getElementById("state3")
        .addEventListener("click", function (event) {
            selectState(this);
            stateStart(event, 3);
        });
    document
        .getElementById("state4")
        .addEventListener("click", function (event) {
            selectState(this);
            stateStart(event, 4);
        });

    // export csv
    document
        .getElementById("exportBtn")
        .addEventListener("click", function (event) {
            exportToCSV();
        });

    const progressBar = document.getElementById("progress");
    progressBar.value = 0;
    progressBar.max = totalSeconds;

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

// I don't know why I passed the event but ignore
// What do I even need to do?
// Disable every button except for stop
async function stateStart(event, stateNum) {
    // disable the rest of the buttons
    const deviceHeight = document.getElementById("height").value;
    const stopBtn = document.getElementById("fullStop");
    const stateBtns = document.getElementsByClassName("stateBtn");

    for (let i = 0; i < 4; i++) {
        stateBtns[i].disabled = true;
    }

    stopBtn.disabled = false;

    // send /send POST request and pass stateNum
    const payload = {
        height: deviceHeight,
        runMode: stateNum, // stateByState
        state: true,
        data: {},
    };

    const response = await fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    startProgress("full");

    startTimer("restart");
    return data;
}

async function fullStart() {
    console.log("HELLO");
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");
    // disable during run
    startBtn.disabled = true;
    stopBtn.disabled = false;

    const deviceHeight = document.getElementById("height").value;

    // send POST request for send
    // will need device height included in payload
    const payload = {
        height: deviceHeight,
        runMode: 5, // fullWalkthrough
        state: null,
        data: {},
    };

    const response = await fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    startProgress("full");

    startTimer("restart");

    await waitCheckStatus();

    // now disable stop button
    stopBtn.disabled = true;
    startBtn.disabled = false;

    // re-enable stop button

    // stop timer

    // can we finish progress bar?

    return data;
}

async function fullStop() {
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");
    // disable while still stopping
    stopBtn.disabled = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // enable after you're done
    startBtn.disabled = false;
    stopBtn.disabled = true;

    stopTimer();
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
        method: "POST",
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

// just keep it clicked
function selectState(btn) {
    // deselect all state buttons first
    document
        .querySelectorAll(".stateBtn")
        .forEach((b) => b.classList.remove("active"));
    // select the clicked one
    btn.classList.add("active");
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

var timeElapsed = 0;
var myTimer;
var myProgress;

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;

    return mins + ":" + (secs < 10 ? "0" + secs : secs);
}

function tick() {
    timeElapsed++;
    document.getElementById("timer").innerHTML = formatTime(timeElapsed);
}

function startTimer(mode) {
    if (mode === "restart") {
        timeElapsed = 0;
    }

    myTimer = setInterval(tick, 1000);
}

function stopTimer() {
    clearInterval(myTimer);
    clearInterval(myProgress);
}

function startProgress(mode, state) {
    var estimatedTime;

    // determine if full or state by state
    if (mode === "full") {
        estimatedTime = estimateData.time.fullWalkthrough;
    } else if (mode === "state") {
        estimatedTime = estimateData.time["state" + state];
    }

    // convert normal time format to one number
    const [mins, secs] = estimatedTime.split(":").map(Number);
    const totalSeconds = mins * 60 + secs;

    // initialize start and max value
    const progressBar = document.getElementById("progress");
    progressBar.value = 0;
    progressBar.max = totalSeconds;

    // use same method for normal timer
    myProgress = setInterval(function () {
        if (timeElapsed >= totalSeconds) {
            clearInterval(myProgress);
            progressBar.value = totalSeconds;
        } else {
            progressBar.value = timeElapsed;
        }
    }, 1000);
}

// ACTUAL EXPORT TO CSV
// This function will combine all the data returned
// Along with the answers to the questions the operator answers
// It should check if the file is empty, and if so then write the
// headers. If not, it should just simply append the results to the
// end of the file.
async function exportToCSV() {
    // let's get information first

    // satisfaction
    const satisfied = document.querySelector(
        `input[name="satisfied"]:checked`,
    ).value;

    // percent of hair pulled back
    const percentHair = document.querySelector(
        `input[name="percentHair"]:checked`,
    ).value;

    // distance
    const distance = document.getElementById("distance").value;

    const timer = document.getElementById("timer").innerHTML;

    const newRow = [satisfied, percentHair, distance, timer];

    const dataObject = {
        data: newRow,
    };

    const response = await fetch("/export", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObject),
    });

    const data = await response.json();

    return data;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitCheckStatus() {
    console.log("I AM IN WAIT CHECK");

    let done = false;

    while (!done) {
        const response = await fetch("http://localhost:5000/checkStatus");
        const data = await response.json();

        console.log("my data", data);

        if (data.message.message === "DONE") {
            console.log("done finallya")
            done = true;
            return "done";
        } else {
            await wait(1000);
        }
    }
    return;
}
