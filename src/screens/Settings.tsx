import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Divider,
         Layout,
         Toggle,
         Text,
         TopNavigation } from '@ui-kitten/components';

import { StyleSheet,
        Dimensions,
        Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222B45'
    },
    settingLayout: {
        flex: 1
    },
    navigationTitle: {
        fontSize: 20,
    }
})

const Settings: SettingsComponentType = ({
    componentId,
}): JSX.Element => {

    const [theme, setTheme] = useState('dark');
    const [isChecked, setChecked] = useState<boolean>(false);

    const onCheckedChange = (isChecked: boolean): void => {
        setChecked(isChecked);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Layout style={styles.settingLayout}>
                <Layout style={{flex:1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 20, alignItems: 'center'}}>
                    <Text>Theme: </Text>
                    <Toggle 
                        checked={isChecked}
                        onChange={onCheckedChange}
                    />
                </Layout>
            </Layout>
        </SafeAreaView>
    )
}

Settings.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'Settings'
        },
        largeTitle: {
            visible: true
        }
    }
})

export default Settings;