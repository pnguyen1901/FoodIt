import * as React from 'react';
import { View, ImageSourcePropType, Image } from 'react-native';
import { ColorProperty } from 'csstype';
import styles from './CellIconStyles';

interface Props {
  key?: string;
  source?: ImageSourcePropType;
  size?: number;
  backgroundColor?: ColorProperty;
  tintColor?: ColorProperty;
  testID?: string;
}

const CellIcon = (props) => {

    const { source, backgroundColor, size , tintColor = '#ffffff', userProfile, ...rest } = props;

    return (
      <View style={[styles.host, { backgroundColor: backgroundColor }, userProfile ? {height: 50, width: 50, borderRadius: 25} : null]}>
        <Image source={source} resizeMode="center" style={[styles.image, { tintColor, width: size, height: size }]} {...rest} />
      </View>
    );
}

export default CellIcon;
