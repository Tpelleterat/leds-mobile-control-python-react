from bluetoothManager import BluetoothManager
from bluetoothService import BluetoothService
from ledManager import LedManager
from multiprocessing import Process


class Manager:
    def __init__(self):
        self.bluetoothManager = BluetoothManager(BluetoothService())
        self.bluetoothManager.subscribeOnMessage(self.bluetoothMessageReceived)

        self.ledManager = LedManager()

    def doTheThing(self):
        
        self.ledManager.initLed()
        
        self.bluetoothManager.startBluetoothServer()

    def bluetoothMessageReceived(self, message):
        if message == "on":
            self.ledManager.turnOnAll()
        elif message == "off":
            self.ledManager.turnOffAll()
        elif message.startswith('leds:'):
            self.ledNumberMessage(message)
        elif message.startswith('color:'):
            self.ledColorMessage(message)
    
    def ledNumberMessage(self, message):
        ledCount = self.extractNumberFromMessage(message)
        self.ledManager.changeNumber(ledCount)

    def extractNumberFromMessage(self, message):
        return int(message.split(":")[1])

    def extractValueFromMessage(self, message):
        return message.split(":")[1]

    def ledColorMessage(self, message):
        messageValue = self.extractValueFromMessage(message)

        tupleRgb = self.colorHexToRgb(messageValue)

        self.ledManager.changeColor(tupleRgb)

    def colorHexToRgb(self, hex):
        return tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))
    
