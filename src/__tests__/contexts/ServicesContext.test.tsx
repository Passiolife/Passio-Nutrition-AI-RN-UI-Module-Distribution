// @ts-nocheck
import React from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { type Services, ServicesProvider, useServices } from '../../contexts';

describe('<ServicesProvider>', () => {
  it('provides the injected services', () => {
    // provide no-op mocks
    const mockServices: Services = {
      dataService: {
        saveFoodLog: () => {
          return Promise.resolve();
        },
        getFoodLogs: () => {
          return Promise.resolve([]);
        },
        deleteFoodLog: () => {
          return Promise.resolve();
        },
        deleteRecipe: () => {
          return Promise.resolve();
        },
        deleteFavoriteFoodItem(): Promise<void> {
          return Promise.resolve();
        },
        saveFavoriteFoodItem: () => {
          return Promise.resolve();
        },
        getFavoriteFoodItems: () => {
          return Promise.resolve([]);
        },
        saveNutritionProfile: () => {
          return Promise.resolve();
        },
        getNutritionProfile: () => {
          return Promise.resolve(undefined);
        },
        getMealLogs: () => {
          return Promise.resolve([]);
        },
        getRecipes: () => {
          return Promise.resolve([]);
        },
        saveRecipe: () => {
          return Promise.resolve();
        },
        getPatientProfile: () => {
          return Promise.resolve(
            require('../assets/json/patient_profile.json')
          );
        },
      },
      analyticsService: {
        logEvent: () => {},
      },
    };
    TestRenderer.create(
      <ServicesProvider services={mockServices}>
        <ExpectServices expect={expect} />
      </ServicesProvider>
    );
  });
});

const ExpectServices: React.FC<{ expect: jest.Expect }> = ({ expect }) => {
  const services = useServices();
  expect(services.analyticsService).toBeDefined();
  expect(services.dataService).toBeDefined();
  return <View />;
};
