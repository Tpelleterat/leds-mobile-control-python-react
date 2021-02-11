import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import Connect from '../components/Connect';
import Scan from '../components/Scan';
import AsyncStorage from '@react-native-community/async-storage';

/** Post edition interface */
interface ConnectScreenProps {
  onDevice: Dispatch<SetStateAction<BluetoothDevice | undefined>>;
}

/** Manage bluetooth connection step (scan and connect) */
const ConnectScreen: FC<ConnectScreenProps> = (props) => {
  const [unableToConnect, setUnableToConnect] = useState(false);
  const [deviceAddress, setDeviceAddress] = useState<string>();
  const [isSavedDeviceAddressLoaded, setIsSavedDeviceAddressLoaded] = useState(
    false,
  );

  const loadDeviceAddress = async () => {
    console.log('Load saved device address');

    let deviceAdrress =
      (await AsyncStorage.getItem('deviceAdress')) || undefined;

    if (deviceAdrress) {
      setDeviceAddress(deviceAdrress);
    } else {
      setUnableToConnect(true);
    }

    setIsSavedDeviceAddressLoaded(true);
  };

  const saveDeviceAddress = async (deviceAdress: string) => {
    console.log('Save device address');

    await AsyncStorage.setItem('deviceAdress', deviceAdress);
  };

  const onConnectedDevice = async (device: BluetoothDevice) => {
    await saveDeviceAddress(device.address);
    props.onDevice(device);
  };

  const onUnableToConnect = async () => {
    console.log('onUnableToConnect');
    setUnableToConnect(true);
  };

  const onDeviceAddressFounded = async (deviceAdress: string) => {
    console.log('onDeviceAddressFounded');
    setDeviceAddress(deviceAdress);
    setUnableToConnect(false);
  };

  useEffect(() => {
    if (!isSavedDeviceAddressLoaded) {
      loadDeviceAddress();
    }
  }, [isSavedDeviceAddressLoaded]);

  return (
    <View style={styles.container}>
      {unableToConnect && isSavedDeviceAddressLoaded && (
        <Scan onDeviceAddressFounded={onDeviceAddressFounded} />
      )}
      {!unableToConnect && isSavedDeviceAddressLoaded && (
        <Connect
          deviceAddress={deviceAddress}
          onConnectedDevice={onConnectedDevice}
          onUnableToConnect={onUnableToConnect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default ConnectScreen;
