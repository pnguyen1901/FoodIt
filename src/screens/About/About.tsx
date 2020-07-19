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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    aboutLayout: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 10
    },
    navigationTitle: {
        fontSize: 20,
    },
    more: {
        opacity: 0.65
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    bodyText: {
        fontSize: 18
    }
})


const FoodItBodyText = `
While living with my coworker back in 2019, he and I were frequently throwing out expired food because of busy schedule and lack of time to keep track of grocery items that we bought. 
\nFrustrated with the situation, I started looking into this problem. I was shocked to learn how food waste has become such a big problem here in America.
\nEach year, 40% of the food produced goes uneaten, resulting in 160 billion pounds of wasted food and costing each US family between $1560 to $2275. 
\nSo I decided to create FoodIt, an app that helps you quickly scan the expiration date of your grocery items and create a reminder to make sure you won't have to toss out your tasty Chobani yogurt just because you had a rough week at work and completely forget about the time. 
\nFoodIt also allows you to share your items with your roommate or your family members
as long as they also download and install the app. I am planning to add more useful features in the near future to provide even more benefits to your daily life.`

const About: AboutComponentType = (

) => {

    const colorScheme: ColorSchemeName = useColorScheme();
    const theme = themes[colorScheme];


    return (
        <SafeAreaView style={[styles.container, 
            { backgroundColor: theme.GroupedBackgroundColor }]}>
            <ScrollView style={[styles.aboutLayout,
                { backgroundColor: theme.GroupedBackgroundColor }
            ]}>
                <Text style={[styles.titleText, { color: theme.LabelColor }]}>How did FoodIt come about?</Text>
                <Text style={[styles.bodyText, { color: theme.SecondaryLabelColor }]}>{FoodItBodyText}</Text>
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

