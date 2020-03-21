import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import { HomeScreen } from '../screens/home.component';
import { DetailsScreen } from '../screens/details.component';
import { createStackNavigator } from '@react-navigation/stack';
import { ItemScreen } from '../screens/item.component';

const BottomTab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const BottomTabBar = ({ navigation, state }) => {
    const onSelect = (index) => {
        navigation.navigate(state.routeNames[index]);
    }

    return (
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                <BottomNavigationTab title='Scan'/>
                <BottomNavigationTab title='List'/>
            </BottomNavigation>
    )
}

const TabNavigator = () => {
    return (
    <BottomTab.Navigator tabBar={props => <BottomTabBar {...props}/>}>
        <BottomTab.Screen name='Scan' component={HomeScreen}/>
        <BottomTab.Screen name='List' component={DetailsScreen}/>
    </BottomTab.Navigator>
    )
}


export const AppNavigator = () => (
    <NavigationContainer>
        <RootStack.Navigator mode="modal" headerMode="none">
            <RootStack.Screen name="main" component={TabNavigator}/>
            <RootStack.Screen name="item-screen" component={ItemScreen}/>
        </RootStack.Navigator>
    </NavigationContainer>
)