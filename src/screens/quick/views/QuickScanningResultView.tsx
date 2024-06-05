import {
  TouchableOpacity,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import React from 'react';

import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { Text } from '../../../components';
import type { QuickResult } from '../../../models';

interface Props {
  result: QuickResult;
  onOpenFoodLogEditor: (passioIDAttributes: QuickResult) => void;
  onClear?: () => void;
}

export const QuickScanningResultView = React.memo((props: Props) => {
  const result = props.result;

  return (
    <View style={scanningResultBaseContainerStyle}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          props.onOpenFoodLogEditor(result);
        }}
      >
        <View style={foodLogContainerStyle}>
          <View style={foodLogImageContainerStyle}>
            <PassioFoodIcon
              passioID={props.result.passioID}
              imageName={props.result.passioID}
              style={foodLogImageStyle}
              entityType={PassioIDEntityType.item}
            />
          </View>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text weight="600" size="_14px" style={foodLogNameStyle}>
              {props.result.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

// Scanning Result Styles....
const scanningResultBaseContainerStyle: ViewStyle = {
  marginHorizontal: 10,
};

const foodLogContainerStyle: ViewStyle = {
  flexDirection: 'row',
};

const foodLogImageContainerStyle: ViewStyle = {
  width: 48,
  height: 48,
  marginHorizontal: 8,
  overflow: 'hidden',
  backgroundColor: 'gray',
  marginVertical: 8,
  borderRadius: 48 / 2,
};

const foodLogImageStyle: ImageStyle = {
  width: 48,
  height: 48,
};

const foodLogNameStyle: TextStyle = {
  textTransform: 'capitalize',
};
