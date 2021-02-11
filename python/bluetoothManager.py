import bluetooth # From pybluez
from EventNotifier import Notifier
import time


class BluetoothManager:

    def __init__(self, bluetoothService):
        self.notifier = Notifier(["onMessage"])
        self.bluetoothService = bluetoothService

    def startBluetoothServer(self):
        self.bluetoothService.startServer()

        while 1:
            print("Wait device connection")
            self.bluetoothService.waitNewConnection()
            print("Device connected")
            self.waitReceivedMessages()
            self.bluetoothService.closeClient()
            print("Device disconnected")

    def waitReceivedMessages(self):
        try:
            while 1:
                data = self.bluetoothService.waitDataReceiced()
                print("received [%s]" % data)
                stringData = data.decode('utf-8')

                self.notifier.raise_event("onMessage", message=stringData)
        except bluetooth.btcommon.BluetoothError as ex:	
             print("Closing socket")

    def subscribeOnMessage(self, callback):
        self.notifier.subscribe("onMessage", callback)
