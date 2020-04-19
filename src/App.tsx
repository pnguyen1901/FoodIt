import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
// import {
//   ApplicationProvider,
//   IconRegistry,
// } from '@ui-kitten/components';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import {
//   mapping,
//   dark,
//   light
// } from '@eva-design/eva';
// import { AppNavigator } from './navigations/BottomNavigation';
// import { Provider } from 'react-redux';
import { withReduxProvider } from './store';
import nodejs from 'nodejs-mobile-react-native';
import { Navigation } from 'react-native-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ITEMS } from './screens';
import { ADDITEM } from './screens';
import { SETTINGS } from './screens';

import ItemsScreen from './screens/Items';
import addItem from './screens/addItem';
import SettingsScreen from './screens/Settings';

// const store = configureStore();

const Screens = new Map<string, React.FC<any>>();

Screens.set(ITEMS, ItemsScreen);
Screens.set(SETTINGS, SettingsScreen);
// Screens.set(ADDITEM, AddItemScreen);
// Register screens
Screens.forEach((C, key) => {
    Navigation.registerComponent(
        key,
        () => gestureHandlerRootHOC(withReduxProvider(C)),
        () => C,
    );
});

Navigation.registerComponent('addItem', () => gestureHandlerRootHOC(withReduxProvider(addItem)));

const App = (): React.ReactFragment => {

  // useEffect(() => {
  //   nodejs.start('main.js');
  //   // nodejs.channel.addListener(
  //   //   'message',
  //   //   (msg) => {
  //   //     console.log('From node: ' + msg);
  //   //   },
  //   //   this 
  //   // );
  // }); 

    // return (
    //     <Provider store={store}>
    //       <IconRegistry icons={EvaIconsPack}/>
    //       <IconRegistry icons={EvaIconsPack}/>
    //     <ApplicationProvider mapping={mapping} theme={light}>
    //       <AppNavigator/>
    //     </ApplicationProvider>
    //     </Provider>    

  // )
        Promise.all([
        FontAwesome5.getImageSource('list-ul', 25),
        FontAwesome5.getImageSource('react', 25),
    ]).then(([listIcon, reactIcon]) => {
        Navigation.setRoot({
            root: {
                bottomTabs: {
                    options: {
                        bottomTabs: {
                            titleDisplayMode: 'alwaysShow',
                        },
                    },
                    children: [{
                    stack: {
                        children: [{
                            component: {
                                name: ITEMS ,
                            },
                        }],
                        options: {
                            bottomTab: {
                                iconColor: '#A1A1A1',
                                textColor: '#A1A1A1',
                                selectedIconColor: '#007aff',
                                selectedTextColor: '#007aff',
                                text: 'Items',
                                icon: listIcon,
                            },
                        },
                    },
                    },{
                    stack: {
                        children: [{
                            component: {
                                name: SETTINGS
                            }
                        }],
                        options: {
                            bottomTab: {
                                iconColor: '#A1A1A1',
                                textColor: '#A1A1A1',
                                selectedIconColor: '#007aff',
                                selectedTextColor: '#007aff',
                                text: 'Settings',
                                icon: require('./assets/icons/25/settings.png')
                            }
                        },
                    }
                    }],
                },
            },
        });
    });
};


export default App;
