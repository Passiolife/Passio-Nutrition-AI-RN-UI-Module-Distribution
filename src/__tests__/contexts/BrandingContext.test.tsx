// @ts-nocheck
import React from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { type Branding, BrandingProvider, useBranding } from '../../contexts';

describe('<BrandingProvider>', () => {
  it('provides the injected branding', () => {
    const mockBranding: Branding = {
      primaryColor: '#123456',
      text: '',
      secondaryText: '',
      purple: '',
      font: '',
      backgroundColor: '',
      white: '',
      black: '',
      searchBody: '',
      carbs: '',
      proteins: '',
      calories: '',
      fat: '',
      border: '',
      gray500: '',
      gray300: '',
      indigo50: '',
    };

    TestRenderer.create(
      <BrandingProvider branding={mockBranding}>
        <ExpectBranding expect={expect} />
      </BrandingProvider>
    );
  });
});

const ExpectBranding: React.FC<{ expect: jest.Expect }> = ({ expect }) => {
  const branding = useBranding();
  expect(branding.primaryColor).toEqual('#123456');
  return <View />;
};
