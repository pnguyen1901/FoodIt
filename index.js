// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './backup/App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import { Navigation } from 'react-native-navigation';
import { setMainRoot, setLoginRoot } from './src/App';

Navigation.events().registerAppLaunchedListener(() => {
    setLoginRoot();
});
