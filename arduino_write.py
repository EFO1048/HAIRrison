import threading
import serial
import serial.tools.list_ports
import time
import requests
import json
from flask import Flask, request, jsonify


# https://github.com/EFOSchool/CS4065-Project2/blob/main/Project2-Goldsberry-Obrien-Krzywkowski/server.py
class ArduinoWrite(
    threading.Thread,
):

    def __init__(self, ser):

        # inherit stuff for thread
        # daemon so no interaction
        super().__init__()
        self.daemon = True
        self.running = False
        self.ser = ser
        self.url = "http://localhost"
        self.port = 5000

    def write(self, data):
        if self.ser:
            print("Board found... writing")
            # ser.write("String here".encode())
            self.ser.write(data.encode("utf-8"))
        else:
            return jsonify({"Error": data})
