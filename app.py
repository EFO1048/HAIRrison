import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from time import sleep
from arduino_listener import ArduinoListener
import threading

app = Flask(__name__)
arduino_thread = ArduinoListener()
arduino_thread.start()


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/connect", methods=["POST"])
def connect():
    arduino_thread.run()
    sleep(1)
    return jsonify({"message": "Connection Successful!"})


@app.route("/continueOn", methods=["GET"])
def continueOn():
    return render_template("main.html")


# frontend > board
@app.route("/send", methods=["POST"])
def send():
    data = request.get_json()
    print(data)
    return "hey"


# board > frontend
# this is triggered in the arduino listening thread
@app.route("/receive", methods=["POST"])
def receive():
    data = request.get_json()
    print(data)
    return "hey"


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "logo.png",
        mimetype="image/png",
    )


if __name__ == "__main__":
    app.run(debug=True)
