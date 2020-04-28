import React, { useEffect, useState } from 'react';
import Cell from '../../components/cell/Cell';
import CellGroup from '../../components/cell/CellGroup';
import { useColorScheme } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { 
    SafeAreaView, 
    StyleSheet, 
    Platform, 
    Dimensions,
} from 'react-native';
import { Navigation } from 'react-native-navigation';


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

const Account: AccountComponentType = ({
    componentId
}) => {
    
    const colorScheme = useColorScheme();
    const theme = themes[colorScheme]
    const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            getStatusBarHeight();
        });

        getStatusBarHeight();

    }, [componentId]);


    const getStatusBarHeight = async () => {
        const navConstants = await Navigation.constants();

        // for more info - https://stackoverflow.com/a/48759750
        if (Platform.OS === 'ios') {
            setKeyboardVerticalOffset(navConstants.statusBarHeight + navConstants.topBarHeight);
        }
    };

    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor: theme.SystemBackgroundColor
        }]}>
            <CellGroup header={'name'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={'Phat Nguyen'}
                />
            </CellGroup>
            <CellGroup header={'email'} theme={theme}>
                <Cell 
                    textInput={true}
                    value={'phatnguyen1901@gmail.com'}
                />
            </CellGroup>
            <CellGroup header={'subcription'} theme={theme}>
                <Cell 
                    title={'Free'}
                    subtitle={'Upgrade'}
                    more={true}
                />
            </CellGroup>
        </SafeAreaView>
    )
}

Account.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Account Settings'
        }
    }
})

export default Account;