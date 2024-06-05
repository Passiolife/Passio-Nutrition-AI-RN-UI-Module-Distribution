// @ts-nocheck
import React from 'react';
import { MockProviders } from '../provider/MockProviders';
import { render } from '@testing-library/react-native';
import { FoodLogEditorModal } from '../../modals';
import { act } from 'react-test-renderer';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

jest.mock('@passiolife/nutritionai-react-native-sdk-v3', () => {
  const mockSDK = {
    getAttributesForPassioID(): Promise<PassioIDAttributes | null> {
      return require('../assets/json/mock_passio_sdk_attribute.json');
    },
  };
  const mockPassioIcon = require('../utils/MockPassioIcon').default;

  return {
    PassioSDK: mockSDK,
    PassioIconView: mockPassioIcon,
    IconSize: 'PX90',
  };
});

describe('Food Log Editor Modal', () => {
  it('Renders correctly', () => {
    const onCancelPress = jest.fn();
    const onSavePress = jest.fn();

    const tree = render(
      <MockProviders>
        <FoodLogEditorModal
          foodLog={require('../assets/json/foodLog.json')}
          isVisible={true}
          onDismissFoodLogModal={onCancelPress}
          onSavedLog={onSavePress}
        />
      </MockProviders>
    );

    expect(tree).toMatchSnapshot();
  });

  it('checked nutrients calories, carbs, proteins and fat matched', () => {
    const onCancelPress = jest.fn();
    const onSavePress = jest.fn();

    const tree = render(
      <MockProviders>
        <FoodLogEditorModal
          foodLog={require('../assets/json/foodLog.json')}
          isVisible={true}
          onDismissFoodLogModal={onCancelPress}
          onSavedLog={onSavePress}
        />
      </MockProviders>
    );

    const calories = tree.getByTestId('testNutrientCalories');
    const carbs = tree.getByTestId('testNutrientCarbs');
    const protein = tree.getByTestId('testNutrientProtein');
    const fat = tree.getByTestId('testNutrientFat');
    expect(calories.props.children).toEqual(150);
    expect(carbs.props.children).toEqual([35, ' g']);
    expect(protein.props.children).toEqual([33, ' g']);
    expect(fat.props.children).toEqual([12, ' g']);
  });

  it('changed progress to checked that they affected to calories, carbs, proteins and fat of nutrients', () => {
    const onCancelPress = jest.fn();
    const onSavePress = jest.fn();
    const tree = render(
      <MockProviders>
        <FoodLogEditorModal
          foodLog={require('../assets/json/foodLog.json')}
          isVisible={true}
          onDismissFoodLogModal={onCancelPress}
          onSavedLog={onSavePress}
        />
      </MockProviders>
    );
    const textInput = tree.getByTestId('testTextInputOfSelectedQuantity');
    act(() => {
      textInput.props.onChangeText('2');
    });

    const calories = tree.getByTestId('testNutrientCalories');
    const carbs = tree.getByTestId('testNutrientCarbs');
    const protein = tree.getByTestId('testNutrientProtein');
    const fat = tree.getByTestId('testNutrientFat');

    expect(calories.props.children).toEqual(300);
    expect(carbs.props.children).toEqual([70, ' g']);
    expect(protein.props.children).toEqual([66, ' g']);
    expect(fat.props.children).toEqual([24, ' g']);
  });
});
