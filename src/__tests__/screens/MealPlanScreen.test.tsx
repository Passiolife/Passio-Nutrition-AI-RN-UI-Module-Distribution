// @ts-nocheck
import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import MyPlanScreen from '../../screens/myPlans/MyPlanScreen';
import { MockProviders } from '../provider/MockProviders';
import { getDayMealPlanFoods } from '../../utils/MealPlanUtils';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { ActionPlanType } from '../../models';

const mockedDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
    useRoute: () => ({
      params: {
        logToDate: new Date(2021, 9, 21, 14, 0, 0),
      },
    }),
  };
});

jest.mock('react-native-uuid', () => {
  let value = 0;
  value++;
  return {
    v4: () => {
      return value;
    },
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
  };
});
describe('MealPlanScreen', () => {
  afterEach(cleanup);
  const referenceDate = new Date(2021, 9, 21, 14, 0, 0);
  Date.now = jest.fn(() => referenceDate.valueOf());

  it('should render meal plan', async () => {
    const mealPlanScreen = await renderComponent();
    const mealTab = mealPlanScreen.getByTestId('testMealPlanClick');
    act(() => fireEvent.press(mealTab));
    expect(mealPlanScreen.toJSON()).toMatchSnapshot();
  });

  it('should render suggestion', async () => {
    const mealPlanScreen = await renderComponent();
    const suggestionTab = mealPlanScreen.getByTestId('testSuggestionClick');
    act(() => fireEvent.press(suggestionTab));
    expect(mealPlanScreen.toJSON()).toMatchSnapshot();
  });

  it('day 1 meal plan recipe name', async () => {
    const mealFoods = await getDayMealPlanFoods(
      1,
      new Date(2021, 9, 21, 14, 0, 0),
      ActionPlanType.balanced
    );
    expect(mealFoods[0]?.name).toEqual('coffee with milk');
  });

  it('day 7 meal plan recipe name', async () => {
    const mealFoods = await getDayMealPlanFoods(
      7,
      new Date(2021, 9, 18, 14, 0, 0),
      ActionPlanType.balanced
    );
    expect(mealFoods[0]?.name).toEqual('cooked oatmeal with berries');
  });
});

const renderComponent = async () => {
  const mealPlanScreen = render(
    <MockProviders>
      <MyPlanScreen />
    </MockProviders>
  );
  return mealPlanScreen;
};
