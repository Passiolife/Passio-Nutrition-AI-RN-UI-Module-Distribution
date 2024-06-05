// @ts-nocheck
import React from 'react';
import renderer from 'react-test-renderer';
import {
  BrandingProvider,
  QuickScanningResultView,
  ServicesProvider,
} from '@passiolife/nutrition-ai-ui-ux';
import { mockBranding, mockServices } from '../../provider/MockProviders';
import GestureRecognizer from 'react-native-swipe-gestures';

describe('ScanningResultView', () => {
  it('renders correctly', () => {
    const onSaveLogs = jest.fn();
    const onOpenFoodLogEditor = jest.fn();
    const onAlternativeFoodLogs = jest.fn();
    const tree = renderer.create(
      <ServicesProvider services={mockServices}>
        <BrandingProvider branding={mockBranding}>
          <QuickScanningResultView
            onSaveLogs={onSaveLogs}
            onAlternateItemCall={onAlternativeFoodLogs}
            passioIDAttributes={require('../../assets/json/passio_sdk_result.json')}
            onOpenFoodLogEditor={onOpenFoodLogEditor}
          />
        </BrandingProvider>
      </ServicesProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('saves the food log when swiping to the right', async () => {
    const onSaveLogs = jest.fn();
    const onAlternativeFoodLogs = jest.fn();
    const onOpenFoodLogEditor = jest.fn();

    const tree = await renderer.create(
      <ServicesProvider services={mockServices}>
        <BrandingProvider branding={mockBranding}>
          <QuickScanningResultView
            onSaveLogs={onSaveLogs}
            onAlternateItemCall={onAlternativeFoodLogs}
            passioIDAttributes={require('../../assets/json/passio_sdk_result.json')}
            onOpenFoodLogEditor={onOpenFoodLogEditor}
          />
        </BrandingProvider>
      </ServicesProvider>
    );
    const swipe = tree.root.findByType(GestureRecognizer).props;
    swipe.onSwipeRight();
    expect(onSaveLogs).toHaveBeenCalled();
  });
});
