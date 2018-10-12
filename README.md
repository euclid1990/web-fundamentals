# Web Fundamentals

All of things i've learned from https://developers.google.com/web/

## Prerequisite

Add root CA cert to the browser

```
Chromium -> Setting -> (Advanced) Manage Certificates -> Import -> 'ca.pem'
```

## Installation

- You need Node.js v6 or higher to run this program. See [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/).

- Clone project and install dependencies

```terminal
$ git clone git@github.com:euclid1990/web-fundamentals.git
$ cd web-fundamentals
$ yarn install
```

## Usage

Run demo

```terminal
$ yarn start
```

## Knowledge

- Launch Android Emulators and iOS Simulators From the Command Line

```terminal
$ emulator -list-avds   # Lists all AVDs you currently have configured
$ emualtor -avd {name}
```

```terminal
$ open -a Simulator
```

- Use `10.0.2.2` to access actual machine localhost in the Android emulator.

- [Inspect and debug live content on your Android device from your development machine.](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)

## Contributing

If you find a bug or think something could be better, please file an issue or
submit a pull request.
