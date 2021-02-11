import {Platform, PermissionsAndroid, Linking, Alert} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default async () => {
  if (Platform.OS !== 'ios') {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (granted) {
      //Check if GPS is on
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
    } else {
      await requestLocationPermission();
    }
  }
};

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Location is required to scan bluetooth.',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      Alert.alert(
        'Location Permission',
        'Location is required to scan bluetooth.',
        [{text: 'OK', onPress: () => Linking.openSettings()}],
        {cancelable: false},
      );
    }
  } catch (err) {
    console.warn(err);
  }
}
