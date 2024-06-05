// @ts-nocheck
import React from 'react';
import {
  type Branding,
  BrandingProvider,
  type Services,
  ServicesProvider,
} from '../../contexts';

export const mockBranding: Branding = {
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

export const mockServices: Services = {
  dataService: {
    saveFoodLog: () => {
      return Promise.resolve();
    },
    deleteFoodLog: () => {
      return Promise.resolve();
    },
    deleteFavoriteFoodItem: () => {
      return Promise.resolve();
    },
    deleteRecipe: () => {
      return Promise.resolve();
    },
    getFoodLogs: async () => {
      return [];
    },
    getFavoriteFoodItems: () => {
      return Promise.resolve(
        require('../assets/json/favorites_food_logs.json')
      );
    },
    saveFavoriteFoodItem: () => {
      return Promise.resolve();
    },
    getMealLogs: async () => {
      return [];
    },
    getRecipes: async () => {
      return [];
    },
    saveRecipe: () => {
      return Promise.resolve();
    },
    saveNutritionProfile: () => {
      return Promise.resolve();
    },
    getNutritionProfile: async () => {
      return Promise.resolve(require('../assets/json/profile.json'));
    },
    getPatientProfile: () => {
      return Promise.resolve(require('../assets/json/patient_profile.json'));
    },
  },
  analyticsService: {
    logEvent: () => {},
  },
};

interface MockProvidersProps extends React.PropsWithChildren {
  services?: Services;
}

export const MockProviders = ({ children, services }: MockProvidersProps) => (
  <BrandingProvider branding={mockBranding}>
    <ServicesProvider
      services={
        services != null || services !== undefined ? services : mockServices
      }
    >
      {children}
    </ServicesProvider>
  </BrandingProvider>
);
