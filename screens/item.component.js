import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Divider,
        Icon,
        TopNavigation,
        Layout,
        Text,
        Button,
        Input, 
        Datepicker,
        TopNavigationAction} from '@ui-kitten/components';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    layout: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        padding: 20,
    },
    inputLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center'
    },
    input: {
        marginLeft: 20,
        width: 250 
    }

})

const BackIcon = (style) => (
    <Icon {...style} name='arrow-back'/>
)

const SaveIcon = (style) => (
    <Icon {...style} name='save-outline'/>
)


export function ItemScreen ({navigation}) {

    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState(new Date());

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
    );

    const ownerId = firebase.auth().currentUser.uid;

    const saveItem = () => {
        firestore().collection('food_items')
            .add({
                brand: brand,
                category: category,
                expiration_date: expirationDate,
                ownerId: ownerId
            })
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                navigation.goBack();
            })
            .catch((error) => {
                console.log("Error adding document:", error);
            })
    };

    const SaveAction = () => (
        <TopNavigationAction icon={SaveIcon} onPress={saveItem}/>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigation title='Add an item' alignment='center' leftControl={BackAction()} rightControls={SaveAction()}/>
            <Divider />
            <Layout style={styles.layout}>
                <Layout style={styles.inputLayout}>
                    <Text
                        category='p1'>
                        Brand
                    </Text>
                    <Input
                    style={styles.input} 
                    placeholder='Select the brand of the item'
                    value={brand}
                    onChangeText={setBrand}/>
                </Layout>
                <Layout style={styles.inputLayout}>
                    <Text
                        category='p1'>
                        Category
                    </Text>
                    <Input
                        style={styles.input} 
                        placeholder='Category'
                        value={category}
                        onChangeText={setCategory}/>                
                </Layout>
                <Layout style={styles.inputLayout}>
                <Text
                    category='p1'>
                    Expiration Date
                </Text>
                <Datepicker
                    style={styles.input} 
                    date={expirationDate}
                    onSelect={setExpirationDate}/>
                </Layout>
                <Layout style={{flex: 6}}>

                </Layout>
            </Layout>
        </SafeAreaView>
    )
}