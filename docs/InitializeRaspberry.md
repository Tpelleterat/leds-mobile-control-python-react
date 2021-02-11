# Rasberry installation instructions

## Step 1 : Create SD Card

Go to [raspberrypi.org](https://www.raspberrypi.org/software/operating-systems/) to download Rasberry Pi OS Lite.

Connect SD Card.

Use balenaEtcher to install downloaded image to the SD Card.

Eject and reconnect SD Card.

## Step 2 : Connect Wifi and enable ssh

Go to SD Card.

Create file **wpa_supplicant.conf** and fill it with these informations :

```txt
country=<Insert 2 letter ISO 3166-1 country code here>
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<Name of your wireless LAN>"
    psk="<Password for your wireless LAN>"
    key_mgmt=WPA-PSK
}
```

more information : [doc](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md)

Create empty file named **ssh**.

Eject SD Card and set to Raspberry.

Search Raspberry pi in the network with you modem interface, PC network scan...

## Step 3 : Update system

Connect to system with SSH :

- use CMD like [Cmder](https://cmder.net/)

```sh
ssh pi@<ip address>
```

- use [putty](https://www.putty.org/)

Default connection infomation :
login : pi
password : raspberry

Update system :

```sh
sudo apt update
```

```sh
sudo apt dist-upgrade
```

```sh
sudo apt clean
```

```sh
sudo reboot
```

## Step 4 : Check if python is installed

```sh
python3 --version
```

if not installed or old version :

```sh
sudo apt install python3
```

```sh
sudo apt install python3-pip
```

## Step 5 : Prepare Python

```sh
sudo apt-get install python3-rpi.gpio
```

```sh
sudo apt-get install bluez python-bluez
```

```sh
python3 -m pip install pybluez
```
