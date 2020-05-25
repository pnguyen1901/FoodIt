import AsyncStorage from '@react-native-community/async-storage';
import { Navigation } from 'react-native-navigation';
import { setMainRoot, setLoginRoot } from './src/App';

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
