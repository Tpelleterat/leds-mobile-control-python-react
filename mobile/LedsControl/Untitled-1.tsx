const connect = async () => {
  let device = await RNBluetoothClassic.connectToDevice(
    'B8:27:EB:C4:CA:71',
    {},
  );

  setDevice(device);
};

const scan = async () => {
  let device = await RNBluetoothClassic.startDiscovery();
};

const send = async () => {
  if (device) {
    await device.write('test');
  }
};

import {BleManager} from 'react-native-ble-plx';

const [bleManager, setBleManager] = useState<BleManager>();

useEffect(() => {
  setBleManager(new BleManager());
}, []);

const scan = async () => {
  if (bleManager) {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('Error scan : ' + JSON.stringify(error));
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device) {
        console.log('Device ');
        console.log(device.id);
        console.log(device.name);
        console.log(device.localName);
        console.log('-----');

        if (device.name === 'leds-mobile-control-python-react') {
          console.warn('Device found !!! ' + device.id);

          bleManager.stopDeviceScan();
        }
      }
    });
  }
};

const scan = async () => {
  let devices = await RNBluetoothClassic.startDiscovery();

  for (let index = 0; index < devices.length; index++) {
    const device = devices[index];

    console.log('Device ');
    console.log(device.id);
    console.log(device.name);
    console.log('-----');
  }
};
