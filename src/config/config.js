import { Platform } from 'react-native';
import Constants from "expo-constants";

import { logger } from 'react-native-logs';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';

const logConfig = {
    transport: colorConsoleAfterInteractions,
};
var log = logger.createLogger(logConfig);

if (__DEV__) {
    log.setSeverity('debug');
} else {
    log.setSeverity('error');
}

export { log };

let server = __DEV__ ? 'http://localhost:8000' : 'http://localhost:8000';
server ="http://192.168.178.40:8000"
let api = "/api/v1";

if(Constants.isDevice) {
    //server = '';
}

if(typeof Constants.manifest.releaseChannel != "undefined") {
    if(Constants.manifest.releaseChannel.startsWith('production')) {
        //server = '';
    }
    if(Constants.manifest.releaseChannel.startsWith('staging')) {
        //server = '';
    }
}

log.debug("API server: " + server);

let config = {
    baseServer: server,
    apiServer: server+api,
    sentry: {
        dsn: 'https://9dcf9580e1294a9e8f38a4ce5804be56@o184844.ingest.sentry.io/5596668',
        enableInExpoDevelopment: false,
        enableInExpoClient: false,
        debug: true
    },
    defaultTheme: 'dark',
    highContrast: 200,
    enableSocialLogin: false,
    emailRegex: /\S+@\S+\.\S+/,
    passwordRegex: /^.{4,}$/,
    showSendImmediately: false,
    enablePush: false,
};

export default config;
