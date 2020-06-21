import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
    width: number,
    height: number,
    placeholder: string,
    roundedPlaceholder: boolean
}

const Avatar = (props: AvatarProps) => {

    const { width, height } = props;
    const { container } = styles;

    const renderPlaceholder = () => {
        const { placeholder, width, height, roundedPlaceholder } = props
        const { placeholderContainer, placeholderText } = styles

        const viewStyle = [placeholderContainer]
        if (roundedPlaceholder) {
            viewStyle.push({ borderRadius: Math.round(width + height)/2 })
        }

        return (
            <View style={viewStyle}>
                <View style={viewStyle}>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        minimumFontScale={0.01}
                        style={[{ fontSize: Math.round(width/2)}, placeholderText]}
                    >
                        {placeholder}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[container, {width: width, height: height} ]}>
            { renderPlaceholder() }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    placeholderContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dddddd",
        height: '100%'
    },
    placeholderText: {
        fontWeight: "700",
        color: "#ffffff"
    }
});

export default Avatar;