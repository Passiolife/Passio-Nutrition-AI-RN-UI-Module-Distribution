import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { MealLabel } from '../../../models';
import { useBranding } from '../../../contexts';

export type AllDay = 'All Day';
interface Props {
  selections: Array<MealLabel | AllDay>;
  selectedName: string;
  onSelectionClick: (val: MealLabel | AllDay) => void;
}

const MealTime: React.FC<Props> = (props) => {
  const { onSelectionClick, selectedName, selections } = props;
  const brandingContext = useBranding();

  const setBtnBackgroundColor = (bgColor: string) => {
    return { backgroundColor: bgColor };
  };

  const setBtnTextColor = (TxtColor: string) => {
    return { color: TxtColor };
  };

  const renderBtn = () => {
    return selections.map((val, index) => (
      <TouchableOpacity
        onPress={() => onSelectionClick(val)}
        key={index}
        style={[
          val === selectedName
            ? setBtnBackgroundColor(brandingContext.primaryColor)
            : setBtnBackgroundColor('#eeeeee'),
        ]}
      >
        <Text
          style={[
            val === selectedName
              ? setBtnTextColor('#ffffff')
              : setBtnTextColor('#333333'),
          ]}
        >
          {val}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View>
      <View>{renderBtn()}</View>
    </View>
  );
};

export default MealTime;
