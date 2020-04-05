import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Divider,
         Layout,
         Toggle,
         Text,
         TopNavigation } from '@ui-kitten/components';

import { StyleSheet } from 'react-native';

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
export const Setting = ({ navigation }) => {

    const [theme, setTheme] = useState('dark');
    const [isChecked, setChecked] = useState<boolean>(false);

    const onCheckedChange = (isChecked: boolean): void => {
        setChecked(isChecked);
    }

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigation title='Settings' alignment='center' titleStyle={styles.navigationTitle}/>
            <Divider/>
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