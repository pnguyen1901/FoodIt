import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-ui-lib';
import React from 'react';



const gutter = 15;

const styles = StyleSheet.create({

    host: {
        flexDirection: 'row'
    },

    underlay: {
        backgroundColor: '#f2f1f6',
    },

    ios:  {
        backgroundColor: '#ffffff',
    },

    android: {
        backgroundColor: 'transparent',
    },

    left: {
        justifyContent: 'center',
        paddingLeft: gutter,
        paddingTop: (gutter / 2),
        paddingBottom: (gutter / 2),
    },

    center : {
        flex: 1,
        flexDirection : 'column',
        paddingRight : gutter,
    },

    right: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: gutter,
    },

    content: {
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: gutter,
        paddingTop: (gutter / 2),
        paddingBottom: (gutter / 2),
        minHeight: 45,
    },

    android: {
        minHeight: 52,
    },

    border: {
        position: 'absolute',
        top: -1,
        left: 0,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#e3e3e3'
    },

    titleText: {
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: 17,
        color: '#000000',
        letterSpacing: -0.37,
    },

    subtitleText: {
        fontSize: 12,
        color: '#000000',
        opacity: 0.75,
        marginRight: 8,
        marginTop: 4,
    },

    value: {
        textAlign: 'right',
        fontSize: 17,
        color: '#000000',
        // TODO: tune opacity
        opacity: 0.7,
        letterSpacing: -0.37,
    },

    more: {
        marginTop: 2,
        marginLeft: 10,
        tintColor: '#000000',
        // TODO: tune opacity
        opacity: 0.65,
    },

    selected: {
        marginTop: 2,
        marginLeft: 10,
        tintColor: 'white',
    }

})

export default styles;