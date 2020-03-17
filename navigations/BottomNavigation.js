import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/home.component';
import { DetailsScreen } from '../screens/details.component';

const BottomTab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => {
    const onSelect = (index) => {
        navigation.navigate(state.routeNames[index]);
    }

    return (
        <SafeAreaView>
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                <BottomNavigationTab title='Scan'/>
                <BottomNavigationTab title='List'/>
            </BottomNavigation>
        </SafeAreaView>
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
        <TabNavigator/>
    </NavigationContainer>
)