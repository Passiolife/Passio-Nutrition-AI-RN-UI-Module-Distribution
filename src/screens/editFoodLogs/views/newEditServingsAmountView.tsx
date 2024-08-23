import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  ProgressSlider,
  SelectServingSize,
  Text,
  TextInput,
} from '../../../components';
import { COLORS } from '../../../constants';
import type { FoodLog, ServingUnit } from '../../../models';
import { maxSliderValue, steps } from '../utils';
import { useBranding } from '../../../contexts';
import { content } from '../../../constants/Content';
import { scaleHeight, scaleWidth } from '../../../utils';
import { updateQuantityOfFoodLog } from '../../../utils/V3Utils';

interface Props {
  foodLog: FoodLog;
  onUpdateFoodLog: (foodLog: FoodLog) => void;
}

const NewEditServingAmountView = ({ foodLog, onUpdateFoodLog }: Props) => {
  const {
    servingUnits,
    selectedUnit,
    selectedQuantity,
    computedWeight,
    foodItems,
  } = foodLog;

  const [maxSlider, setMaximumSlider] = useState<number>(
    maxSliderValue(selectedQuantity)
  );

  const onChangeTextInput = (qty: number) => {
    onQuantityUpdate(qty);
    setMaximumSlider(maxSliderValue(qty));
  };

  const onSlideProgress = (qty: number) => {
    onQuantityUpdate(qty);
  };

  const onQuantityUpdate = (qty: number) => {
    onUpdateFoodLog(updateQuantityOfFoodLog(foodLog, qty));
  };

  const servingWeight =
    computedWeight?.value ?? foodItems[0]?.computedWeight.value;
  const servingUnit = computedWeight?.unit ?? foodItems[0]?.computedWeight.unit;

  const onTapServingSize = async ({ mass, unit }: ServingUnit) => {
    if (unit.toLowerCase() === selectedUnit.toLowerCase()) {
      return;
    }
    const defaultWeight = servingWeight ?? 0;
    const newQuantity = Number(defaultWeight / mass);
    foodLog.selectedQuantity = Number(
      newQuantity < 10 ? newQuantity : newQuantity
    );
    foodLog.selectedUnit = unit;
    onUpdateFoodLog({ ...foodLog });

    if (
      unit.toLowerCase() === 'gram' ||
      unit.toLowerCase() === 'g' ||
      unit.toLowerCase() === 'ml'
    ) {
      onQuantityUpdate(100);
      return;
    }
    onQuantityUpdate(1);
  };
  const { primaryColor, searchBody } = useBranding();

  const onChangeText = (text: string) => {
    if (text && text.length > 0) {
      onChangeTextInput(parseFloat(text));
    } else {
      onChangeTextInput(0);
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.cardHeader}>
        <Text weight="600" size="title" color="text" style={styles.headerText}>
          {content.editAmount}
          <Text
            weight="400"
            size="_16px"
            color="text"
            style={styles.servingAmountTxt}
          >
            {` (${servingWeight?.toFixed(1).replaceAll('.0', '')} ${servingUnit})`}
          </Text>
        </Text>
      </View>

      <View style={styles.content}>
        <TextInput
          keyboardType="numeric"
          returnKeyLabel="Update"
          returnKeyType="done"
          testID="testTextInputOfSelectedQuantity"
          defaultValue={selectedQuantity.toString()}
          onEndEditing={(event) => {
            const text = event.nativeEvent.text;
            onChangeText(text);
          }}
          onBlur={(event) => {
            const text = event.nativeEvent.text;
            onChangeText(text);
          }}
          containerStyle={styles.containerInputStyle}
          style={styles.inputStyle}
        />

        <SelectServingSize
          servingSize={servingUnits}
          selectedUnit={selectedUnit}
          onTapServingSize={onTapServingSize}
        />
      </View>
      <View style={styles.sliderLayout}>
        <ProgressSlider
          sliderMaxValue={maxSlider}
          sliderValue={selectedQuantity}
          minimumTrackTintColor={primaryColor}
          maximumTrackTintColor={searchBody}
          thumbTintColor={primaryColor}
          step={steps(maxSlider)}
          onChangeSliderValue={onSlideProgress}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleHeight(12),
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleHeight(13),
    flexDirection: 'column',
  },
  headerText: {},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleHeight(6),
    justifyContent: 'space-between',
  },
  chevDownTouchStyle: {
    width: 22,
    marginHorizontal: 16,
    height: 22,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  chevDown: {
    width: 10,
    height: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginTop: scaleHeight(16),
  },
  containerInputStyle: {
    minWidth: 50,
    textAlign: 'right',
  },
  inputStyle: {
    paddingVertical: scaleHeight(12),
    backgroundColor: 'transparent',
    textAlign: 'center',
    minWidth: scaleWidth(50),
  },
  servingSizeBtn: {
    marginStart: 16,
    paddingVertical: 8,
    maxWidth: 150,
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 25,
  },
  servingSizeBtnTxt: {
    color: COLORS.white,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  servingAmountTxt: {
    fontSize: 15,
    marginStart: 16,
    color: COLORS.grey7,
  },
  sliderLayout: {
    marginTop: 10,
  },
  contentContainerStyle: {
    flexDirection: 'row',
  },
  nutrientCards: {
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 8,
    flexDirection: 'column',
  },
  altBtnTxt: {
    fontSize: 14,
    paddingVertical: 7,
  },
  cardFooter: {
    marginTop: 10,
  },
  onPressTouch: {
    overflow: 'hidden',
  },
});

export default React.memo(NewEditServingAmountView);
