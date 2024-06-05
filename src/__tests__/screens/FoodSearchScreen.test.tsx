// @ts-nocheck
import { type RenderAPI, render } from '@testing-library/react-native';

import { FoodSearchScreen } from '../../screens';
import { MockProviders } from '../provider/MockProviders';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import React from 'react';

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
        logToDate: { undefined },
        logToMeal: { undefined },
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
    PassioIDEntityType: {
      group: 'group',
    },
  };
});

describe('search view', () => {
  it('Renders correctly with no data', () => {
    let tree: RenderAPI;
    tree = render(
      <>
        <MockProviders>
          <FoodSearchScreen
            logToDate={undefined}
            logToMeal={undefined}
            defaultPassioIdAttributes={[]}
            isLoading={false}
          />
        </MockProviders>
      </>
    );
    expect(tree).toMatchSnapshot();
  });

  it('Renders correctly with search results', async () => {
    const passioResult: PassioIDAttributes[] = require('../assets/json/search_result.json');
    let tree: RenderAPI;
    tree = render(
      <>
        <MockProviders>
          <FoodSearchScreen
            logToDate={undefined}
            logToMeal={undefined}
            defaultPassioIdAttributes={passioResult}
            isLoading={false}
          />
        </MockProviders>
      </>
    );
    expect(tree).toMatchSnapshot();
  });
});
