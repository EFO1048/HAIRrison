import threading
import serial
import serial.tools.list_ports
import time
import requests
import json


# https://github.com/EFOSchool/CS4065-Project2/blob/main/Project2-Goldsberry-Obrien-Krzywkowski/server.py
class ArduinoListener(threading.Thread):

    def __init__(self):

        # inherit stuff for thread
        # daemon so no interaction
        super().__init__()
        self.daemon = True
        self.running = False
        self.ser = None
        self.url = "http://localhost"
        self.port = 5000

    # find correct port

    def find_arduino_port(self):
        ports = serial.tools.list_ports.comports()

        print("LISTENER STARTING: \n\n\n\n\n", ports)

        # https://pyserial.readthedocs.io/en/latest/tools.html#serial.tools.list_ports.ListPortInfo
        # IDK what arduino would look like
        for p in ports:
            if "Arduino" in p.description or "USB Serial" in p.description:
                print("FOUND, DETAILS:")
                print(p)
                return p.device

    # actually use the port
    # https://stackoverflow.com/questions/22271309/sending-a-character-to-the-arduino-serial-port-using-pythons-pyserial
    def connect_board(self):

        # someone tell me what baudrate to use
        baud = 9600

        port = self.find_arduino_port()
        if port is None:
            print("No board found")
            return None

        # make serial object to connect to
        self.ser = serial.Serial(port=port, baudrate=baud, timeout=1)
        time.sleep(3)
        print("Connected to board")
        return self.ser

    # this is for connect route just literally check if it is good to go
    def check_connection(self):
        if not self.ser:
            return False

        return True

    def run(self):

        # if no port yet then connect it
        if not self.ser:
            self.ser = self.connect_board()

        # endpoint for this
        endpoint = self.url + ":" + str(self.port) + "/receive"

        # MAIN LISTENING LOOP
        # while running, if ser.in_waiting, then readLine
        # https://forum.arduino.cc/t/trying-to-read-serial-data-sent-by-the-board-over-serial-im-at-my-wits-end-here/1327027/6
        while self.running:
            if self.ser.in_waiting():
                line = self.ser.readline().decode("utf-8").strip()
                json_data = json.loads(line)
                if json_data:
                    try:
                        # send POST request to localhost server
                        requests.post(endpoint, json=json_data)
                    except Exception as e:
                        print(f"Failed: {e}")
                # need to wait so thread doesnt get freaked out
                time.sleep(0.1)
