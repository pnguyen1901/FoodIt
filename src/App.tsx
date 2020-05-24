import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import React from 'react';
import { withReduxProvider } from './store';
import nodejs from 'nodejs-mobile-react-native';
import { Navigation } from 'react-native-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { LOGIN } from './screens';
import { ITEMS } from './screens';
import { ITEM } from './screens';
import { ADDITEM } from './screens';
import { SETTINGS } from './screens';
import { ACCOUNT } from './screens';
import { REMINDER } from './screens';

import LogInScreen from './screens/LogIn/LogIn';
import ItemsScreen from './screens/Items/Items';
import addItem from './screens/AddItem/AddItem';
import SettingsScreen from './screens/Settings/Settings';
import AccountScreen from './screens/Account/Account';
import ItemScreen from './screens/Item/Item';
import ReminderScreen from './screens/Item/Reminder';
import { useColorScheme } from 'react-native-appearance';
import { themes } from './components/Theme/Theme';

// const store = configureStore();

const Screens = new Map<string, React.FC<any>>();

Screens.set(LOGIN, LogInScreen);
Screens.set(ITEMS, ItemsScreen);
Screens.set(SETTINGS, SettingsScreen);
Screens.set(ACCOUNT, AccountScreen);
Screens.set(ITEM, ItemScreen);
Screens.set(REMINDER, ReminderScreen);
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

export const setMainRoot = () => {

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


export const setLoginRoot = () => {
    
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: LOGIN
                        }
                    }
                ]
            }
        }
    })
}
