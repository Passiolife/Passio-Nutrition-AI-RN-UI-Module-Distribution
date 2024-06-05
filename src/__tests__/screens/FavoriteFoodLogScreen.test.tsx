// @ts-nocheck
import React from 'react';
import {
  render,
  type RenderAPI,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { MockProviders } from '../provider/MockProviders';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { MyFavoritesScreen } from '../../screens';

const mockedDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
    useIsFocused: () => jest.fn(),
    useRoute: () => ({
      params: {
        logToDate: undefined,
        logToMeal: undefined,
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

describe('FavoriteFoodLog Screen', () => {
  it('Renders correctly with no data', async () => {
    Date.now = jest.fn(() => new Date(2021, 9, 21, 14, 0, 0).valueOf());
    let tree: RenderAPI;
    tree = render(
      <MockProviders>
        <MyFavoritesScreen />
      </MockProviders>
    );

    await waitForElementToBeRemoved(() => tree.getByText('Please Wait....'));
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Renders correctly when favorites are present', async () => {
    Date.now = jest.fn(() => new Date(2021, 9, 21, 14, 0, 0).valueOf());
    let tree: RenderAPI;
    tree = render(
      <MockProviders>
        <MyFavoritesScreen />
      </MockProviders>
    );
    await waitForElementToBeRemoved(() => tree.getByText('Please Wait....'));
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
