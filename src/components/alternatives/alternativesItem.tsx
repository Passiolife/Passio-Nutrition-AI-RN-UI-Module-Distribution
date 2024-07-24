import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import React from 'react';

import { PassioFoodIcon } from '../passio/PassioFoodIcon';
import { useBranding, type Branding } from '../../contexts';
import { scaleHeight } from '../../utils';
import { Text } from '../texts';
import type { QuickResult } from '../../models';
import { ICONS } from '../../assets';

interface Props {
  alternate: QuickResult;
  onLogPress: (result: QuickResult) => void;
}

const AlternateFoodLogView = ({ alternate, onLogPress }: Props) => {
  const styles = alternateFoodLogViewStyle(useBranding());
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <PassioFoodIcon
          passioID={alternate.passioID}
          imageName={alternate.passioID}
          style={styles.image}
          entityType={PassioIDEntityType.item}
        />
      </View>
      <View style={styles.textConainer}>
        <Text
          weight="600"
          size="_14px"
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.text}
        >
          {alternate.name}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
        }}
        onPress={() => {
          onLogPress(alternate);
        }}
      >
        <Image
          source={ICONS.newAddPlus}
          style={{
            height: 28,
            width: 28,
            alignSelf: 'center',
            marginHorizontal: 16,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const alternateFoodLogViewStyle = ({ indigo50 }: Branding) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      alignContent: 'center',
      backgroundColor: indigo50,
      paddingVertical: scaleHeight(10),
      marginTop: scaleHeight(8),
      marginHorizontal: scaleHeight(12),
    },
    imageContainer: {
      width: 42,
      height: 42,
      marginLeft: 16,
      borderRadius: 21,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    image: {
      width: 42,
      height: 42,
    },
    text: {
      textTransform: 'capitalize',
    },
    textConainer: {
      alignSelf: 'center',
      textTransform: 'capitalize',
      flex: 1,
      marginHorizontal: 16,
    },
  });

export default AlternateFoodLogView;
