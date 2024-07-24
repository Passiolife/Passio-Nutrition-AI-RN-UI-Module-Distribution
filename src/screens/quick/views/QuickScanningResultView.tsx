import {
  Image,
  TouchableOpacity,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import React from 'react';

import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { Card, Text } from '../../../components';
import type { QuickResult } from '../../../models';
import { ICONS } from '../../../assets';

interface Props {
  result: QuickResult;
  onOpenFoodLogEditor: (passioIDAttributes: QuickResult) => void;
  onFoodLog: (passioIDAttributes: QuickResult) => void;
  onClear?: () => void;
}

export const QuickScanningResultView = React.memo((props: Props) => {
  const result = props.result;

  return (
    <Card style={scanningResultBaseContainerStyle}>
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
              iconID={props.result.passioID}
              style={foodLogImageStyle}
              entityType={PassioIDEntityType.item}
            />
          </View>
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text weight="600" size="_14px" style={foodLogNameStyle}>
              {props.result.name}
            </Text>
            {props.result.barcode && (
              <Text
                weight="500"
                size="_14px"
                color={'secondaryText'}
                style={foodLogNameStyle}
              >
                {`UPC: ${props.result.barcode}`}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
            }}
            onPress={() => {
              props.onFoodLog(props.result);
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
      </TouchableOpacity>
    </Card>
  );
});

// Scanning Result Styles....
const scanningResultBaseContainerStyle: ViewStyle = {
  marginHorizontal: 10,
  marginTop: 10,
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
