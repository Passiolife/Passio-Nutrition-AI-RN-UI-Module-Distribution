// @ts-nocheck
import React from 'react';
import renderer from 'react-test-renderer';
import {
  BrandingProvider,
  QuickScanningLoadingView,
  ServicesProvider,
} from '@passiolife/nutrition-ai-ui-ux';
import { mockBranding, mockServices } from '../../provider/MockProviders';
describe('ScanningLoadingView', () => {
  it('renders correctly', async () => {
    const tree = renderer.create(
      <ServicesProvider services={mockServices}>
        <BrandingProvider branding={mockBranding}>
          <QuickScanningLoadingView />
        </BrandingProvider>
      </ServicesProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
