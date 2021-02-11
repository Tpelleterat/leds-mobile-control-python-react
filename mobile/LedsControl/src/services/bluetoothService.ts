import {EventRegister} from 'react-native-event-listeners';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

class BluetoothService {
  private static _myInstance: BluetoothService;
  private _scanning: boolean;
  private _availableDevices: BluetoothDevice[] = [];

  get AvailableDevices(): BluetoothDevice[] {
    return this._availableDevices;
  }

  constructor() {
    this._scanning = false;
  }

  /**
   * @returns {BluetoothService}
   */
  static getInstance(): BluetoothService {
    if (BluetoothService._myInstance == null) {
      BluetoothService._myInstance = new BluetoothService();
    }

    return this._myInstance;
  }

  subscribeDeviceConnected(callback: (isConnected: boolean) => void): string {
    let result = EventRegister.addEventListener('onDeviceConnected', callback);

    return this.manageEventSubscribeResult(result);
  }

  subscribeAvailableDeviceListChanged(
    callback: (devices: BluetoothDevice[]) => void,
  ): string {
    let result = EventRegister.addEventListener(
      'onAvailableDeviceListChanged',
      callback,
    );

    return this.manageEventSubscribeResult(result);
  }

  startScan() {
    if (!this._scanning) {
      this._scanning = true;
      new Promise((resolve, reject) => {
        this.scan();
      });
    }
  }

  async stopScan() {
    if (this._scanning) {
      this._scanning = true;
      await RNBluetoothClassic.cancelDiscovery();
    }
  }

  private async scan(self: BluetoothService) {
    console.log('scan start');

    do {
      let devices = await RNBluetoothClassic.startDiscovery();

      await RNBluetoothClassic.cancelDiscovery();

      let areDifferent = this.compareNewScannedDevices(devices);

      if (areDifferent) {
        this._availableDevices = devices;
        this.onAvailableDeviceListChanged(this._availableDevices);

        console.log('scan end, contains change');
      } else {
        console.log('scan end, no change');
      }
    } while (this._scanning);
  }

  private onAvailableDeviceListChanged(list: BluetoothDevice[]) {
    EventRegister.emit('onAvailableDeviceListChanged', list);
  }

  private manageEventSubscribeResult(result: string | boolean): string {
    if (typeof result === 'string') {
      return result.toString();
    } else {
      throw 'CallBack should be a function';
    }
  }

  private compareNewScannedDevices(newList: BluetoothDevice[]) {
    var onlyInAvailableList = this._availableDevices.filter(
      this.comparer(newList),
    );
    var onlyInNewList = newList.filter(this.comparer(this._availableDevices));

    return onlyInAvailableList.concat(onlyInNewList).length > 0;
  }

  private comparer(list: BluetoothDevice[]) {
    return function (current: BluetoothDevice) {
      return (
        list.filter(function (other) {
          return other.address === current.address;
        }).length == 0
      );
    };
  }

  unsubscribe(id: string) {
    EventRegister.removeEventListener(id);
  }
}

export default BluetoothService.getInstance();
