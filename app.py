import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from time import sleep
from arduino_listener import ArduinoListener
from arduino_write import ArduinoWrite
import json
import threading
import csv

app = Flask(__name__)

CSV_FILE = "export_data.csv"

received_msg = {}

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


# this one should just check - might not need it even
@app.route("/connect", methods=["POST"])
def connect():
    is_connected = arduino_listening_thread.check_connection()
    sleep(3)
    if is_connected:
        return jsonify({"message": "Connection Successful!"})
    else:
        return jsonify({"message": "Connection Error!"})


@app.route("/continueOn", methods=["GET"])
def continueOn():
    return render_template("main.html")


# This send method will need to transform JSON
# into a utf string that can be sent over the arduino
@app.route("/send", methods=["POST"])
def send():
    data = request.get_json()
    str_data = str(data)

    # send to write thread
    arduino_write_thread.write(str_data)
    return jsonify({"message": str_data})


# This route will be triggered in the listener thread
# so all this will need to do is collect the request
# as a string and translate it into utf-8
@app.route("/receive", methods=["POST"])
def receive():
    res = request.get_json()
    body = res["height"]

    if body:
        received_msg["message"] = "DONE"
        return jsonify({"message": "Body returned"})
    else:
        return jsonify({"message": "There was an error"})

@app.route("/checkStatus", methods=["GET"])
def checkStatus():
    if (received_msg["message"] == "DONE"):
        response = jsonify({"message": received_msg})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response    
    else:
        return jsonify({"message": "not done"})
    


@app.route("/export", methods=["POST"])
def export():
    newrow = request.get_json()["data"]

    headers = [
        "satisfied",
        "percentHairGathered",
        "distance",
        "time",
    ]

    # If empty then write headers
    with open(CSV_FILE, "a") as file_obj:
        writer = csv.writer(file_obj)

        # is empty
        # If file is empty, f.tell() will be 0
        if file_obj.tell() == 0:
            writer.writerow(headers)

        # then write next row
        writer.writerow(newrow)

    return jsonify({"status": "saved"})


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"),
        "logo.png",
        mimetype="image/png",
    )


if __name__ == "__main__":

    # start Flask first in background thread
    flask_thread = threading.Thread(
        target=lambda: app.run(debug=False, use_reloader=False, port=5000)
    )
    flask_thread.daemon = True
    flask_thread.start()

    # wait for Flask to be ready
    sleep(2)

    # start Arduino listener - this calls connect_board() and run() internally
    arduino_listening_thread = ArduinoListener()
    arduino_listening_thread.start()

    # wait for Arduino to connect
    sleep(4)

    # grab serial object the listener already opened
    board = arduino_listening_thread.ser

    # write thread
    arduino_write_thread = ArduinoWrite(board)
    arduino_write_thread.start()

    # keep main thread alive
    while True:
        sleep(1)
