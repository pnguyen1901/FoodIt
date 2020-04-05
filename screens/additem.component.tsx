import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
require('datejs');
import RNCalendarEvents from 'react-native-calendar-events/index.ios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/BottomNavigation';

type AddItemNavigationProp = StackNavigationProp<
    RootStackParamList,
    'AddItem'
>;

type AddItemProps = {
    navigation: AddItemNavigationProp
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101426'
    },
    topNavigation: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    layout: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: 20,
        marginBottom: -40
    },
    inputLayout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center'
    },
    input: {
        // marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
    }

})

const BackIcon = (style) : React.ReactElement => (
    <Icon {...style} name='arrow-back'/>
)

const SaveIcon = (style) : React.ReactElement => (
    <Icon {...style} name='save-outline'/>
)


export const AddItem: React.FC<AddItemProps> = ({navigation}) => {

    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const expiration_date = useSelector(state => state.itemReducer.expiration_date);

    const navigateBack = (): void => {
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
                RNCalendarEvents.saveEvent(category, {
                    calendarId: '123',
                    startDate: '2020-04-12T02:42:55.457Z',
                    endDate: '2020-04-12T10:42:55.457Z',
                    title: category + brand,
                    alarms: [{
                        date: '2020-04-05T10:42:55.457Z'
                    }]
                }).then(status => console.log(status))
                .catch(err => console.log(err));
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
            <TopNavigation style={styles.topNavigation} title='Add an item' alignment='center' leftControl={BackAction()} rightControls={SaveAction()}/>
            <Divider />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Layout style={styles.layout}>
                {/* <Layout style={styles.inputLayout}> */}
                    <Text
                        category='h6'>
                        Brand
                    </Text>
                    <Input
                    style={styles.input} 
                    placeholder='Select the brand of the item'
                    value={brand}
                    onChangeText={setBrand}/>
                {/* </Layout> */}
                {/* <Layout style={styles.inputLayout}> */}
                    <Text
                        category='h6'>
                        Category
                    </Text>
                    <Input
                        style={styles.input} 
                        placeholder='Category'
                        value={category}
                        onChangeText={setCategory}/>                
                {/* </Layout> */}
                {/* <Layout style={styles.inputLayout}> */}
                <Text
                    category='h6'>
                    Expiration Date
                </Text>
                <Datepicker
                    style={styles.input} 
                    date={Date.parse(expiration_date)}
                    // date={expirationDate}
                    onSelect={''}/>
                {/* </Layout> */}
                <Layout style={{flex: 1}}>

                </Layout>
            </Layout>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}