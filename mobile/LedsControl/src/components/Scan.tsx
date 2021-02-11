import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import requestLocationPermission from '../utils/RequestLocationPermission';
import {Button, StyleSheet, Text, View} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import BluetoothService from '../services/bluetoothService';

/** Post edition interface */
interface ScanProps {
  onDeviceAddressFounded: (deviceAdress: string) => void;
}

/** Manage leds */
const Scan: FC<ScanProps> = (props) => {
  const [isScanPending, setIsScanPending] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  const runScan = useCallback(async () => {
    await requestLocationPermission();
    BluetoothService.startScan();
  }, []);

  const scan = async () => {
    if (!isScanPending) {
      console.log('scanning ...');
      setIsScanPending(true);
      let devices = await RNBluetoothClassic.startDiscovery();
      let ledDevice: BluetoothDevice | undefined = undefined;

      for (let index = 0; index < devices.length; index++) {
        const device = devices[index];

        if (device.name === 'leds-mobile-control-python-react') {
          ledDevice = device;
        }
      }

      await RNBluetoothClassic.cancelDiscovery();

      if (ledDevice) {
        props.onDeviceAddressFounded(ledDevice.address);
      } else {
        setIsScanPending(false);
      }

      console.log('scan end');
    }
  };

  const onAvailableDeviceListChanged = (list: BluetoothDevice[]) => {
    setDevices(list);
    console.log('onAvailableDeviceListChanged');

    for (let index = 0; index < list.length; index++) {
      const device = list[index];

      console.log('device : ' + device.name);

      if (device.name === 'leds-mobile-control-python-react') {
        props.onDeviceAddressFounded(device.address);
      }
    }
  };

  //Run on start to start scan
  useEffect(() => {
    let eventId: string = BluetoothService.subscribeAvailableDeviceListChanged(
      onAvailableDeviceListChanged,
    );

    runScan();

    return () => {
      BluetoothService.unsubscribe(eventId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scanning ...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 80,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Scan;
