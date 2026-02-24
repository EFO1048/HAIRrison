import serial

# find correct port
def find_arduino_port():
    ports = serial.tools.list_ports.comports()
    
    
    # https://pyserial.readthedocs.io/en/latest/tools.html#serial.tools.list_ports.ListPortInfo 
    # IDK what arduino would look like
    for p in ports:
        if 'Arduino' in p.description or 'USB Serial' in p.description:
            print("FOUND, DETAILS:")
            print(p)
            return p.device

