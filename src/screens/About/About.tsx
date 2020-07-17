import React from 'react';
import { 
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet
} from 'react-native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { themes } from '../../components/Theme/Theme';
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    aboutLayout: {
        flex: 1
    },
    navigationTitle: {
        fontSize: 20,
    },
    more: {
        opacity: 0.65
    }
})

const About: AboutComponentType = (

) => {

    const colorScheme: ColorSchemeName = useColorScheme();
    const theme = themes[colorScheme];


    return (
        <SafeAreaView style={[styles.container, 
            { backgroundColor: theme.GroupedBackgroundColor }]}>
            <ScrollView style={styles.aboutLayout}>
                <Text style={{ backgroundColor: theme.LabelColor, fontSize: 20 }}>How did FoodIt come about?</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

About.options = () => ({
    topBar: {
        visible: true,
        title: {
            text: 'About FoodIt'
        }
    }
})

export default About;

