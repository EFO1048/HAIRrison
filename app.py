from flask import Flask, render_template, request, jsonify
from time import sleep

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/connect", methods=["POST"])
def connect():
    sleep(2)
    return jsonify({"message": "Connection Successful!"})


@app.route("/continueOn", methods=["GET"])
def continueOn():
    return render_template("main.html")


if __name__ == "__main__":
    app.run(debug=True)
