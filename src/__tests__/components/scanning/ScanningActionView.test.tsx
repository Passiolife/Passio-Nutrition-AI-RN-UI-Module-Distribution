// @ts-nocheck
import React from 'react';
import renderer from 'react-test-renderer';
import {
  BrandingProvider,
  QuickScanningActionView,
  ServicesProvider,
} from '@passiolife/nutrition-ai-ui-ux';
import { mockBranding, mockServices } from '../../provider/MockProviders';
describe('ScanningActionView', () => {
  it('renders correctly', async () => {
    const onClosed = jest.fn();
    const tree = renderer.create(
      <ServicesProvider services={mockServices}>
        <BrandingProvider branding={mockBranding}>
          <QuickScanningActionView onClosedPressed={onClosed} />
        </BrandingProvider>
      </ServicesProvider>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
