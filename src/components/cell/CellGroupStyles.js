import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
        
    hostAndroid: {
            borderBottomWidth: 1,
            borderBottomColor: '#e3e3e3',
            backgroundColor: '#ffffff',
        },
        
        itemsIOS: {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: '#e3e3e3',
        
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#e3e3e3',
        },
        
        header: {
            paddingTop: 16,
            paddingBottom: 7.5,
        
            paddingLeft: 15,
            paddingRight: 15,
        },

        headerText: {
        fontSize: 13,
        // TODO: tune opacity
        opacity: 0.75,
        letterSpacing: -0.05,
        },

        android: {
            color: 'white',
        },
        
        footer: {
            paddingTop: 7.5,
            paddingBottom: 7.5,
        
            paddingLeft: 15,
            paddingRight: 15,
        },
        
        footerText: {
            fontSize: 13,
            color: '#000000',
            // TODO: tune opacity
            opacity: 0.65,
            letterSpacing: -0.05,
        }
})

export default styles;