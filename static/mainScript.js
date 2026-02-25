document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectBtn").addEventListener("click", testConnection);
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