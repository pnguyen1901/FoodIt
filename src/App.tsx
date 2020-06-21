import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import React from 'react';
import { withReduxProvider } from './store';
import { Navigation } from 'react-native-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { LOGIN } from './screens';
import { ITEMS } from './screens';
import { ITEM } from './screens';
import { ADDITEM } from './screens';
import { CAMERA } from './screens';
import { SETTINGS } from './screens';
import { ACCOUNT } from './screens';
import { REMINDER } from './screens';
import { SHAREITEM } from './screens';
import { INVITECONTACTS } from './screens';

import LogInScreen from './screens/LogIn/LogIn';
import ItemsScreen from './screens/Items/Items';
import addItem from './screens/AddItem/AddItem';
import ItemScreen from './screens/Item/Item';
import CameraScreen from './screens/Camera/Camera';
import SettingsScreen from './screens/Settings/Settings';
import AccountScreen from './screens/Account/Account';
import ReminderScreen from './screens/Item/Reminder';
import ShareItemScreen from './screens/ShareItem/ShareItem';
import InviteContactsScreen from './screens/InviteContacts/InviteContacts';
import AsyncStore from '@react-native-community/async-storage';


// const store = configureStore();

const Screens = new Map<string, React.FC<any>>();

Screens.set(LOGIN, LogInScreen);
Screens.set(ITEMS, ItemsScreen);
Screens.set(ITEM, ItemScreen);
Screens.set(CAMERA, CameraScreen);
Screens.set(SETTINGS, SettingsScreen);
Screens.set(ACCOUNT, AccountScreen);
Screens.set(REMINDER, ReminderScreen);
Screens.set(SHAREITEM, ShareItemScreen);
Screens.set(INVITECONTACTS, InviteContactsScreen);
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

// Persist user status after logging in
const setLoggedIn = async () => {
    try {
        await AsyncStore.setItem('isLoggedIn', 'true');
        console.log('Set logged in to true');
    } catch (e) {
        console.log(e);
    }
}

// Persist user status after logging out
const setLoggedOut = async () => {
    try {
        await AsyncStore.setItem('isLoggedIn', 'false');
        console.log('Set logged in to false');
    } catch (e) {
        console.log(e);
    }
}


export const setMainRoot = () => {


        Promise.all([
        FontAwesome5.getImageSource('list-ul', 25),
        FontAwesome5.getImageSource('camera', 25),
    ]).then(([listIcon, cameraIcon]) => {
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
                    },
                    {
                    stack: {
                        children: [{
                            component: {
                                name: CAMERA
                            }
                        }],
                        options: {
                            bottomTab: {
                                iconColor: '#A1A1A1',
                                textColor: '#A1A1A1',
                                selectedIconColor: '#007aff',
                                selectedTextColor: '#007aff',
                                text: 'Scan New Item',
                                icon: cameraIcon,
                            }
                        }
                    }
                    },
                    {
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
        setLoggedIn();
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
    setLoggedOut();
}
