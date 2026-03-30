// DUMMY TEST DATA FOR LATER:
const estimateData = {
    time: {
        "fullWalkthrough": "0:10",
        "state1": "1:00",
        "state2": "0:35",
        "state3": "0:47",
        "state4": "1:00"
    },
    measurements: {
        "sensor1": 100,
        "sensor2": 50
    }
};

// DUMMY TEST DATA FOR SENSORS
const sensorData = {
    "height": null,
    "runMode": null,
    "state": null,
    "data": [
        {
            "sensor": 1,
            "currReading": 10
        },
        {
            "sensor": 2,
            "currReading": 78
        },
        {
            "sensor": 3,
            "currReading": 57
        },
        {
            "sensor": 4,
            "currReading": 23
        }
    ]
}

// fetch estimate data



document.addEventListener("DOMContentLoaded", () => {
    // going to run once and combine empty logic
    renderSensors();


    // needed to separate these because btn is out of the dom
    const connectBtn = document.getElementById("connectBtn")
    if (connectBtn) {
        connectBtn.addEventListener("click", testConnection);
    }

    // radio buttons for state by state or full
    document.getElementById("fullWalkthrough").addEventListener("click",disableStateStart);
    document.getElementById("stateByState").addEventListener("click", enableStateStart);

    // full start and stop
    document.getElementById("fullStart").addEventListener("click", function(event) {
        fullStart()
    });

    document.getElementById("fullStop").addEventListener("click", function(event){
        fullStop();
    });

    // state buttons
    document.getElementById("state1").addEventListener("click", function (event) {
        selectState(this);
        stateStart(event, 1)
    });
    document.getElementById("state2").addEventListener("click", function (event) {
        selectState(this);
        stateStart(event, 2)
    });
    document.getElementById("state3").addEventListener("click", function (event) {
        selectState(this);
        stateStart(event, 3)
    });
    document.getElementById("state4").addEventListener("click", function (event) {
        selectState(this);
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

async function fullStart() {
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");
    // disable during run
    startBtn.disabled = true;
    stopBtn.disabled = false;

    startProgress('full');

    startTimer('restart')
}

async function fullStop() {
    const startBtn = document.getElementById("fullStart");
    const stopBtn = document.getElementById("fullStop");
    // disable while still stopping
    stopBtn.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 1000))

    // enable after you're done
    startBtn.disabled = false;
    stopBtn.disabled = true;

    stopTimer();
}

async function loadSensorData() {
    const newData = setInterval(function() {
        alert('heyyy')
    }).then(function (response) { return response.json(); })
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

// just keep it clicked
function selectState(btn) {
    // deselect all state buttons first
    document.querySelectorAll(".stateBtn").forEach(b => b.classList.remove("active"));
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
    if (mode === 'restart') {
        timeElapsed = 0;
    }

    myTimer = setInterval(tick, 1000)
}

function stopTimer() {
    clearInterval(myTimer);
    clearInterval(myProgress);
}

function startProgress(mode, state) {
    var estimatedTime;

    // determine if full or state by state
    if (mode === 'full') {
        estimatedTime = estimateData.time.fullWalkthrough;
    } else if (mode === 'state') {
        estimatedTime = estimateData.time["state" + state];
    }
        

    // convert normal time format to one number
    const [mins, secs] = estimatedTime.split(":").map(Number);
    const totalSeconds = (mins * 60) + secs;

    // initialize start and max value
    const progressBar = document.getElementById("progress");
    progressBar.value = 0;
    progressBar.max = totalSeconds;

    // use same method for normal timer 
    myProgress = setInterval(function() {
        if (timeElapsed >= totalSeconds) {
            clearInterval(myProgress);
            progressBar.value = totalSeconds;
        } else {
            progressBar.value = timeElapsed;
        }
    }, 1000);
}

// this is just rendering, will be called by fetch eventually
function renderSensors() {
    const container = document.querySelector(".infoContainer");

    if (!sensorData.data || sensorData.data.length === 0) {
        container.innerHTML = "<p>Please run the device to see sensor data.</p>";
        return;
    }

    container.innerHTML = sensorData.data.map(sensor => `
        <div>
            Sensor ${sensor.sensor}
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;Data Point: ${sensor.currReading}
        </div>
    `).join("");
}

// downloadable file 
function exportToCSV() {
    // grab headers from the keys of the first object
    const headers = Object.keys(sensorData.data[0]);
    const rows = sensorData.data.map(s => Object.values(s));

    const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sensor_data.csv";
    a.click();

    URL.revokeObjectURL(url);
}