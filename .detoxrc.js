/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'expo.ios': {
      type: 'ios.app',
      build: 'npx expo run:ios --configuration Debug',
      binaryPath: '/Users/tannguyen/Library/Developer/Xcode/DerivedData/CryptoVN-eqzxmmyukjrctxdnemmglfouzzby/Build/Products/Debug-iphonesimulator/CryptoVN.app'
    },
    'expo.android': {
      type: 'android.apk',
      build: 'npx expo run:android --variant debug',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        id: 'A4D548B9-2BF7-4B85-987A-BFDE78FF1230'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    'ios.sim': {
      device: 'simulator',
      app: 'expo.ios'
    },
    'android.emu': {
      device: 'emulator',
      app: 'expo.android'
    }
  }
};
