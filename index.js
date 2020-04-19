// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './backup/App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { Navigation } from 'react-native-navigation';

// Note:
// in order to test Redux and MobX separately,
// please comment unnecessary import, this is important
// because RNN registers screens for both of them if two imports are presented

import startApp from './src/App';

Navigation.events().registerAppLaunchedListener(() => {
    startApp();
});
