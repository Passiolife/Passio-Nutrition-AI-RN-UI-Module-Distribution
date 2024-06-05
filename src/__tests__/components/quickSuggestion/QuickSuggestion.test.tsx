// @ts-nocheck
import React from 'react';
import {
  BrandingProvider,
  ServicesProvider,
} from '@passiolife/nutrition-ai-ui-ux';
import { cleanup, render } from '@testing-library/react-native';
import { mockBranding, mockServices } from '../../provider/MockProviders';
import { QuickSuggestions } from '../../../screens/meallogss/views/QuickSuggesstions';
import type { QuickSuggestion } from '../../../models/QuickSuggestion';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

type Mock = jest.Mock;

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: () => jest.fn(),
  };
});

jest.mock('@passiolife/nutritionai-react-native-sdk-v3', () => {
  const mockSDK = {
    getAttributesForPassioID(): Promise<PassioIDAttributes | null> {
      return require('../../assets/json/mock_passio_sdk_attribute.json');
    },
  };
  const mockPassioIcon = require('../../utils/MockPassioIcon').default;

  return {
    PassioSDK: mockSDK,
    PassioIconView: mockPassioIcon,
    IconSize: 'PX90',
    PassioIDEntityType: {
      group: 'group',
    },
  };
});

describe('QuickSuggestion', () => {
  afterEach(cleanup);

  it('should render correctly', async () => {
    const onFoodItemClickCall = jest.fn();
    const quickSuggestionComponent = renderComponent(
      require('../../utils/json/quickSuggestion.json'),
      onFoodItemClickCall
    );
    expect(quickSuggestionComponent.toJSON()).toMatchSnapshot();
  });

  it('should show no quick suggestion message ', async () => {
    const onFoodItemClickCall = jest.fn();
    const quickSuggestionComponent = renderComponent([], onFoodItemClickCall);
    expect(quickSuggestionComponent.toJSON()).toMatchSnapshot();
  });

  const renderComponent = (
    quickSuggestedAttributes: QuickSuggestion[],
    onFoodItemClickCall: Mock
  ) => {
    const quickSuggestions = render(
      <ServicesProvider services={mockServices}>
        <BrandingProvider branding={mockBranding}>
          <QuickSuggestions
            quickSuggestedAttributes={quickSuggestedAttributes}
            onFoodItemClickCall={onFoodItemClickCall}
          />
        </BrandingProvider>
      </ServicesProvider>
    );
    return quickSuggestions;
  };
});
