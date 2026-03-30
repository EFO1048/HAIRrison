import serial
import time
import serial.tools.list_ports


# find correct port
def find_arduino_port():
    ports = serial.tools.list_ports.comports()

    # https://pyserial.readthedocs.io/en/latest/tools.html#serial.tools.list_ports.ListPortInfo
    # IDK what arduino would look like
    for p in ports:
        if "Arduino" in p.description or "USB Serial" in p.description:
            print("FOUND, DETAILS:")
            print(p)
            return p.device


# actually use the port
# https://stackoverflow.com/questions/22271309/sending-a-character-to-the-arduino-serial-port-using-pythons-pyserial
def connect_board():

    # someone tell me what baudrate to use
    baud = 9600

    port = find_arduino_port()
    if port is None:
        print("No board found")
        return None

    # make serial object to connect to
    ser = serial.Serial(port=port, baudrate=baud, timeout=1)
    time.sleep(3)
    print("Connected to board")
    return ser
