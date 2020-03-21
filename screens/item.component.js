import React from 'react';
import { SafeAreaView, Button, Text } from 'react-native';

export function ItemScreen ({navigation}) {
    return (
        <SafeAreaView>
            <Text>This is a modal</Text>
            <Button onPress={() => navigation.goBack()} title="Dismiss"/>
        </SafeAreaView>
    )
}