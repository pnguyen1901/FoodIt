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
import React from 'react';
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

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

const store = configureStore();

const App = (): React.ReactFragment => (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack}/>
      <IconRegistry icons={EvaIconsPack}/>
    <ApplicationProvider mapping={mapping} theme={dark}>
      <AppNavigator/>
    </ApplicationProvider>
    </Provider>    

);


export default App;
