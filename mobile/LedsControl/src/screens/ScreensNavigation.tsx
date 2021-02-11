import React, {FC, useCallback, useEffect, useState} from 'react';
import {StyleProp, ViewStyle, View} from 'react-native';
import {
  BluetoothDevice,
  BluetoothDeviceEvent,
} from 'react-native-bluetooth-classic';

import ConnectScreen from './ConnectScreen';
import LedsControlScreen from './LedsControlScreen';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

/** Manage when common interfaces should be visible (connection view, led controle view) */
const ScreensNavigation: FC = () => {
  const [device, setdevice] = useState<BluetoothDevice | undefined>(undefined);

  let screenComponent = null;

  useEffect(() => {
    if (device) {
      let subscription = RNBluetoothClassic.onDeviceDisconnected(
        onDeviceDisconnected,
      );

      return () => {
        subscription.remove();
      };
    }
  }, [device]);

  const onDeviceDisconnected = (event: BluetoothDevice) => {
    if (event.address === device?.address) {
      setdevice(undefined);
    }
  };

  if (!device) {
    screenComponent = <ConnectScreen onDevice={setdevice} />;
  } else {
    screenComponent = <LedsControlScreen device={device} />;
  }

  return <>{screenComponent}</>;
};

export default ScreensNavigation;
