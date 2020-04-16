/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten TypeScript template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import {
  mapping,
  dark,
  light
} from '@eva-design/eva';
import { AppNavigator } from './navigations/BottomNavigation';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import nodejs from 'nodejs-mobile-react-native';
/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

const store = configureStore();

const App = (): React.ReactFragment => {

  useEffect(() => {
    nodejs.start('main.js');
    // nodejs.channel.addListener(
    //   'message',
    //   (msg) => {
    //     console.log('From node: ' + msg);
    //   },
    //   this 
    // );
  }); 

    return (
        <Provider store={store}>
          <IconRegistry icons={EvaIconsPack}/>
          <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider mapping={mapping} theme={light}>
          <AppNavigator/>
        </ApplicationProvider>
        </Provider>    

  )
};


export default App;
