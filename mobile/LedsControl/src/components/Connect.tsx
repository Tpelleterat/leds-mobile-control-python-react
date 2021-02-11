import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import AsyncStorage from '@react-native-community/async-storage';

interface ConnectProps {
  onConnectedDevice: (device: BluetoothDevice) => void;
  deviceAddress: string | undefined;
  onUnableToConnect: () => void;
}

/** Manage connection */
const Connect: FC<ConnectProps> = (props) => {
  const [isConnectFail, setIsConnectFail] = useState(false);
  const [isConnectPending, setIsConnectPending] = useState(true); // Replace by enum

  const connect = useCallback(async () => {
    console.log('Connect');
    setIsConnectPending(true);
    setIsConnectFail(true);

    try {
      let device = await RNBluetoothClassic.connectToDevice(
        props.deviceAddress,
        {},
      );

      props.onConnectedDevice(device);
    } catch (error) {
      setIsConnectFail(true);
    }

    setIsConnectPending(false);
  }, [props.deviceAddress]);

  useEffect(() => {
    connect();
  }, [props.deviceAddress]);

  let connectLabel = !isConnectFail ? 'Connect ...' : "Can' connect device.";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{connectLabel}</Text>
      {isConnectFail && !isConnectPending && (
        <Button onPress={connect} title={'Retry'} />
      )}
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

export default Connect;
