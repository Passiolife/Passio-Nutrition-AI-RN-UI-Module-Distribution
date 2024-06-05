import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  ProgressSlider,
  SelectServingSize,
  Text,
  TextInput,
} from '../../../components';
import { COLORS } from '../../../constants';
import type { FoodItem, ServingInfo, ServingUnit } from '../../../models';
import {
  calculateComputedWeightAmount,
  maxSliderValue,
  steps,
  updatingFoodItem,
} from '../utils';
import { useBranding } from '../../../contexts';
import { content } from '../../../constants/Content';
import { scaleHeight, scaleWidth } from '../../../utils';

interface Props {
  servingInfo: ServingInfo;
  foodItems: FoodItem[];
  onUpdateServingInfo: (
    servingInfo: ServingInfo,
    foodItems: FoodItem[]
  ) => void;
}

const EditServingAmountView = (props: Props) => {
  const [maxSlider, setMaximumSlider] = useState<number>(
    maxSliderValue(props.servingInfo.selectedQuantity)
  );
  const [selectedQty, setSelectedQty] = useState<number>(
    props.servingInfo.selectedQuantity
  );

  useEffect(() => {
    setSelectedQty(props.servingInfo.selectedQuantity);
  }, [props.servingInfo.selectedQuantity]);

  const onChangeTextInput = (qty: number) => {
    setMaximumSlider(maxSliderValue(qty));
    updateServingInfo(qty, props.servingInfo.selectedUnit);
  };
  const onSlideProgress = (qty: number) => {
    updateServingInfo(qty, props.servingInfo.selectedUnit);
  };
  const onTapServingSize = async (servingSize: ServingUnit) => {
    setMaximumSlider(maxSliderValue(servingSize.mass));
    updateServingInfo(servingSize.mass, servingSize.unit);
  };
  const updateServingInfo = (qty: number, unit: string) => {
    let foodItems = updatingFoodItem(
      props.servingInfo,
      props.foodItems,
      qty,
      unit
    );
    const copyOfServingInfo: ServingInfo = {
      ...props.servingInfo,
      selectedUnit: unit,
      selectedQuantity: parseFloat(qty.toString()),
    };
    props.onUpdateServingInfo(copyOfServingInfo, foodItems);
  };

  const { primaryColor, searchBody } = useBranding();
  return (
    <Card style={styles.container}>
      <View style={styles.cardHeader}>
        <Text weight="600" size="_16px" color="text" style={styles.headerText}>
          {content.editAmount}
          <Text
            weight="400"
            size="_16px"
            color="text"
            style={styles.servingAmountTxt}
          >
            {` (${calculateComputedWeightAmount(
              props.servingInfo.selectedQuantity,
              props.servingInfo.servingUnits,
              props.servingInfo.selectedUnit
            )} g )`}
          </Text>
        </Text>
      </View>

      <View style={styles.content}>
        <TextInput
          keyboardType="numeric"
          testID="testTextInputOfSelectedQuantity"
          value={props.servingInfo.selectedQuantity.toString()}
          onChangeText={(text) => {
            if (text.length > 0) {
              onChangeTextInput(parseFloat(text));
            } else {
              onChangeTextInput(0);
            }
          }}
          containerStyle={styles.containerInputStyle}
          style={styles.inputStyle}
        />

        <SelectServingSize
          servingSize={props.servingInfo.servingUnits}
          selectedUnit={props.servingInfo.selectedUnit}
          onTapServingSize={onTapServingSize}
        />
      </View>
      <View style={styles.sliderLayout}>
        <ProgressSlider
          sliderMaxValue={maxSlider}
          sliderValue={selectedQty}
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

export default React.memo(EditServingAmountView);
