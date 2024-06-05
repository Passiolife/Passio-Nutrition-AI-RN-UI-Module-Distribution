// @ts-nocheck
import React from 'react';
import { MockProviders } from '../provider/MockProviders';
import { render } from '@testing-library/react-native';
import { EditFavoriteFoodLogScreen } from '../../screens';
import renderer, { act } from 'react-test-renderer';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

const mockedDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      dispatch: mockedDispatch,
    }),
    useRoute: () => ({
      params: {
        favoriteFoodItem: require('../assets/json/favorite_food_logs.json'),
      },
    }),
  };
});

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

describe('EditFavoriteFoodLogScreen Screen', () => {
  it('Renders correctly', () => {
    const tree = renderer.create(
      <MockProviders>
        <EditFavoriteFoodLogScreen />
      </MockProviders>
    );
    expect(tree).toMatchSnapshot();
  });

  it('checked nutrients calories, carbs, proteins and fat matched', async () => {
    const tree = render(
      <MockProviders>
        <EditFavoriteFoodLogScreen />
      </MockProviders>
    );
    const calories = tree.getByTestId('testNutrientCalories');
    const carbs = tree.getByTestId('testNutrientCarbs');
    const protein = tree.getByTestId('testNutrientProtein');
    const fat = tree.getByTestId('testNutrientFat');
    expect(calories.props.children).toEqual(210);
    expect(carbs.props.children).toEqual([1, ' g']);
    expect(protein.props.children).toEqual([17, ' g']);
    expect(fat.props.children).toEqual([14, ' g']);
  });

  it('changed progress to checked that they affected to calories, carbs, proteins and fat of nutrients', async () => {
    const tree = render(
      <MockProviders>
        <EditFavoriteFoodLogScreen />
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
    expect(calories.props.children).toEqual(420);
    expect(carbs.props.children).toEqual([2, ' g']);
    expect(protein.props.children).toEqual([34, ' g']);
    expect(fat.props.children).toEqual([28, ' g']);
  });
});
