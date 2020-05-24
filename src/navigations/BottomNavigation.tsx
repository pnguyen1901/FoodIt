import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout} from '@ui-kitten/components';
import { Items } from '../screens/items.component';
import { Setting } from '../screens/settings.component';
import { createStackNavigator } from '@react-navigation/stack';
import { AddItem } from '../screens/additem.component';
import { Icon } from '@ui-kitten/components';
import { Camera } from '../screens/camera.component';
import SquareImageCropper from '../screens/cropImage.component';
import SignIn from '../screens/LogIn/LogIn';

// create an object type with mappings for route name to the params of the route
export type RootStackParamList = {
    Items: undefined,
    Settings: undefined,
    AddItem: undefined,
    Camera: undefined,
    SignIn: undefined,
    Main: undefined
}

const BottomTab = createBottomTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();

const ListIcon = (style: React.CSSProperties) => (
    <Icon {...style} name='calendar-outline'/>
)

const HomeIcon = (style) => (
    <Icon {...style} name='home-outline'/>
)

const SettingIcon = (style) => (
    <Icon {...style} name='settings-2-outline'/>
)

const BottomTabBar = ({ navigation, state }) => {
    const onSelect = (index: number) => {
        navigation.navigate(state.routeNames[index]);
    }

    return (
        <Layout style={{paddingBottom: 30}}>
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                {/* <BottomNavigationTab title='Scan' icon={HomeIcon}/> */}
                <BottomNavigationTab title='Items' icon={ListIcon}/>
                <BottomNavigationTab title='Settings' icon={SettingIcon}/>
            </BottomNavigation>
        </Layout>
    )
}

const TabNavigator = () => {
    return (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props}/>}>
        {/* <BottomTab.Screen name='Scan' component={HomeScreen}/> */}
        <BottomTab.Screen name='Items' component={Items}/>
        <BottomTab.Screen name='Settings' component={Setting}/>
    </BottomTab.Navigator>
    )
}


export const AppNavigator = () => (
    <NavigationContainer>
        <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen name="SignIn" component={SignIn}/>
            <RootStack.Screen name="Main" component={TabNavigator}/>
            <RootStack.Screen name="AddItem" component={AddItem}/>
            <RootStack.Screen name="Camera" component={Camera}/>
        </RootStack.Navigator>
    </NavigationContainer>
)