import AsyncStorage from '@react-native-community/async-storage';
import { Navigation } from 'react-native-navigation';
import { setMainRoot, setLoginRoot } from './src/App';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});


Navigation.events().registerAppLaunchedListener(() => {
    
    const isUserLoggedIn = async () => {
        try {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            console.log(isLoggedIn);
            if(isLoggedIn === 'true') {
                setMainRoot();
            } else {
                console.log(isLoggedIn);
                setLoginRoot();
            }
        } catch (e) {
            console.log(e);
        }
    }
    isUserLoggedIn();
});
