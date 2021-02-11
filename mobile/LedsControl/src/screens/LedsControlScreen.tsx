import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import Slider from '@react-native-community/slider';
import {ColorPicker} from 'react-native-color-picker';
import {HsvColor} from 'react-native-color-picker/dist/typeHelpers';
import tinycolor from 'tinycolor2';

interface LedsControlScreenProps {
  device: BluetoothDevice;
}

/** Manage leds */
const LedsControlScreen: FC<LedsControlScreenProps> = (props) => {
  const onLedsNumberChange = (value: number) => {
    sendToDevice('leds', value.toString());
  };

  const sendToDevice = (action: string, value: string) => {
    try {
      let message = buildMessage(action, value);
      props.device.write(message);
    } catch (error) {
      console.warn('Send bluetooth error : ' + JSON.stringify(error));
    }
  };

  const buildMessage = (action: string, value: string) => {
    const messageSize = 12;

    let secondPartSize = messageSize - action.length;
    let requiredZero = secondPartSize - value.length;

    let finalMessage = action + ':';
    for (let index = 0; index < requiredZero - 1; index++) {
      finalMessage += '0';
    }
    finalMessage += value;

    return finalMessage;
  };

  const colorChanged = (rgbColor: HsvColor) => {
    let hexColor = tinycolor(rgbColor).toHexString();
    console.log(hexColor);

    let color = hexColor.replace('#', '');

    sendToDevice('color', color);
  };

  return (
    <View style={styles.rootcontainer}>
      <View style={styles.container}>
        <View style={styles.ledNumberSlider}>
          <Slider
            style={styles.verticalSlider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="Grey"
            maximumTrackTintColor="Black"
            onValueChange={onLedsNumberChange}
          />
        </View>

        <View style={styles.colorPanel}>
          <ColorPicker
            onColorChange={colorChanged}
            style={{flex: 1}}
            hideSliders={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'row',
    marginLeft: 50,
    marginRight: 50,
  },
  ledNumberSlider: {
    height: 200,
    width: 50,
  },
  verticalSlider: {
    width: 200,
    height: 50,
    position: 'absolute',
    top: 75,
    left: -75,
    transform: [{rotate: '-90deg'}],
  },
  colorPanel: {
    height: 200,
    flex: 1,
  },
});

export default LedsControlScreen;
