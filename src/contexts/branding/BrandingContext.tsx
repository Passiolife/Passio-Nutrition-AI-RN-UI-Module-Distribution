import React, { useContext } from 'react';
import type { Branding } from './Branding';
import type { ExternalBranding } from './ExternalBranding';

const defaultBranding: Branding = {
  primaryColor: 'rgba(79, 70, 229, 1)',
  text: 'rgba(17, 24, 39, 1)',
  secondaryText: 'rgba(107, 114, 128, 1)',
  purple: 'rgba(79, 70, 229, 1)',
  font: 'Passio-Regular',
  backgroundColor: 'rgba(249, 250, 251, 1)',
  white: 'white',
  black: 'rgba(0, 0, 0, 1)',
  searchBody: 'rgba(242, 245, 251, 1)',
  fat: 'rgba(139, 92, 246, 1)',
  proteins: 'rgba(16, 185, 129, 1)',
  calories: 'rgba(245, 158, 11, 1)',
  carbs: 'rgba(14, 165, 233, 1)',
  border: 'rgba(229, 231, 235, 1)',
  gray500: 'rgba(107, 114, 128, 1)',
  gray300: 'rgba(209, 213, 219, 1)',
  indigo50: 'rgba(238, 242, 255, 1)',
  error: 'rgba(239, 68, 68, 1)',
  card: 'white',
  header: 'white',
  footer: 'white',
};

const BrandingContext = React.createContext(defaultBranding);

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps extends React.PropsWithChildren {
  branding?: ExternalBranding;
}

export const BrandingProvider = ({
  branding,
  children,
}: BrandingProviderProps) => (
  <BrandingContext.Provider value={{ ...defaultBranding, ...branding }}>
    {children}
  </BrandingContext.Provider>
);
