import bluetooth # From pybluez

class BluetoothService:

  def __init__(self):
    self.port = 1
    self.receivedBuffer = 12
    self.server_sock = bluetooth.BluetoothSocket( bluetooth.RFCOMM )

  def startServer(self):
    self.server_sock.bind(("",self.port))
    self.server_sock.listen(1)

  def waitNewConnection(self):
    self.client_sock,self.address = self.server_sock.accept()

  def waitDataReceiced(self):
    data = self.client_sock.recv(self.receivedBuffer)
    return data

  def closeServer(self):
    self.server_sock.close()

  def closeClient(self):
    self.client_sock.close()

  def sendMessage(message):
    self.server_sock.send(message)

  def lookUpNearbyBluetoothDevices():
    nearby_devices = bluetooth.discover_devices()
    for bdaddr in nearby_devices:
      print(str(bluetooth.lookup_name( bdaddr )) + " [" + str(bdaddr) + "]")