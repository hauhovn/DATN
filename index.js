// baochau - 30/05/21

import {AppRegistry} from 'react-native';
import App from './src';
import {TestScreen} from './src/app/view/test_screen'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TestScreen);
