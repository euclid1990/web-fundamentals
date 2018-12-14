# Web Fundamentals

All of things I've learned from https://developers.google.com/web.

## Slide

- [Web Fundamentals](https://www.slideshare.net/CuCh1/web-fundamentals-123155699)

## Prerequisite

Add root CA cert to the browser (Chrome or Chromium).

```
Browser -> Settings -> (Advanced) Manage Certificates -> Import -> 'ca.pem'
```

For Ubuntu only, inside "Manage Certificates" setting, you have to choose "Servers" tab before clicking "IMPORT" button.

## Requirements

- NodeJS: ^8.10 || >=9.10
- Yarn: ^1.1

## Installation

- Clone project and install dependencies.

```bash
$ git clone git@github.com:euclid1990/web-fundamentals.git
$ cd web-fundamentals
$ yarn install
```

## Usage

Start the application.

```bash
$ yarn start
```

## Knowledge

- Launch Android Emulators and iOS Simulators From the Command Line.

```bash
$ emulator -list-avds   # Lists all AVDs you currently have configured
$ emualtor -avd {name}
```

```bash
$ open -a Simulator
```

- Use `10.0.2.2` to access actual machine localhost in the Android emulator.

- [Inspect and debug live content on your Android device from your development machine.](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)

- [Use Web Inspector to Debug Mobile Safari](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html)

## Contributing

If you find a bug or think something could be better, please file an issue or
submit a pull request.
