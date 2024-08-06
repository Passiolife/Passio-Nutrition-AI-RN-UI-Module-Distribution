import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { BackNavigation } from '../../../components';
import { ICONS } from '../../../assets';

interface Props {
  onClosedPressed: () => void;
  onInfoPress: () => void;
}

export const QuickScanningActionView = (props: Props) => {
  return (
    <>
      <View style={closeActionContainer}>
        <BackNavigation
          onBackArrowPress={props.onClosedPressed}
          title="Food Scanner"
          rightIcon={ICONS.foodScannerInfo}
          onRightPress={props.onInfoPress}
        />
      </View>
    </>
  );
};

const closeActionContainer: ViewStyle = {};
