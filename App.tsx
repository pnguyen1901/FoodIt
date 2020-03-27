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
  ImageProps,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import {
  mapping,
  dark as theme,
} from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './navigations/BottomNavigation';
import { Provider } from 'react-redux';
import { configureStore } from './store';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const HeartIcon = (style: ImageStyle): React.ReactElement<ImageProps> => (
  <Icon {...style} name='heart'/>
);

const store = configureStore();

const App = (): React.ReactFragment => (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack}/>
      <IconRegistry icons={EvaIconsPack}/>
    <ApplicationProvider mapping={mapping} theme={theme}>
      <AppNavigator/>
    </ApplicationProvider>
    </Provider>    

);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});

export default App;
