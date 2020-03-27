import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout} from '@ui-kitten/components';
import { HomeScreen } from '../screens/home.component';
import { DetailsScreen } from '../screens/details.component';
import { SettingScreen } from '../screens/settings.component';
import { createStackNavigator } from '@react-navigation/stack';
import { ItemScreen } from '../screens/item.component';
import { Icon } from '@ui-kitten/components';
import { CameraScreen } from '../screens/camera.component';

const BottomTab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const ListIcon = (style) => (
    <Icon {...style} name='calendar-outline'/>
)

const HomeIcon = (style) => (
    <Icon {...style} name='home-outline'/>
)

const SettingIcon = (style) => (
    <Icon {...style} name='settings-2-outline'/>
)

const BottomTabBar = ({ navigation, state }) => {
    const onSelect = (index) => {
        navigation.navigate(state.routeNames[index]);
    }

    return (
        <Layout style={{paddingBottom: 30}}>
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                <BottomNavigationTab title='Scan' icon={HomeIcon}/>
                <BottomNavigationTab title='Items' icon={ListIcon}/>
                <BottomNavigationTab title='Settings' icon={SettingIcon}/>
            </BottomNavigation>
        </Layout>
    )
}

const TabNavigator = () => {
    return (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props}/>}>
        <BottomTab.Screen name='Scan' component={HomeScreen}/>
        <BottomTab.Screen name='Items' component={DetailsScreen}/>
        <BottomTab.Screen name='Settings' component={SettingScreen}/>
    </BottomTab.Navigator>
    )
}


export const AppNavigator = () => (
    <NavigationContainer>
        <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen name="main" component={TabNavigator}/>
            <RootStack.Screen name="add-item-screen" component={ItemScreen}/>
            <RootStack.Screen name="camera-screen" component={CameraScreen}/>
        </RootStack.Navigator>
    </NavigationContainer>
)