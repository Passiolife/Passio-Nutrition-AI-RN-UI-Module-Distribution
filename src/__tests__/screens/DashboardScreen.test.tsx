// @ts-nocheck
import React from 'react';
import { DashboardScreen } from '../../screens/dashbaord/DashboardScreen';
import { MockProviders } from '../provider/MockProviders';
import {
  render,
  type RenderAPI,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';

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
  };
});

jest.mock('../../screens/scanning/usePassioAuthConfig', () => {
  return {
    usePassioAuthConfig: () => ({
      isReady: true,
    }),
  };
});

describe('Dashboard Screen :', () => {
  it('checked if user has not completed onBoarding and render screen ', async () => {
    let tree: RenderAPI;
    tree = await render(
      <>
        <MockProviders>
          <DashboardScreen />
        </MockProviders>
      </>
    );
    await waitForElementToBeRemoved(() => tree.queryByTestId('tesViewBlank'));
    expect(tree.queryByTestId('testViewOnBoardingCard')).not.toEqual(null);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('checked if user has completed onBoarding and render screen', async () => {
    let tree: RenderAPI;
    await AsyncStorageHelper.setOnBoardingCompleted();
    tree = await render(
      <>
        <MockProviders>
          <DashboardScreen />
        </MockProviders>
      </>
    );
    await waitForElementToBeRemoved(() => tree.queryByTestId('tesViewBlank'));
    expect(tree.queryByTestId('testViewNutritionDataCard')).not.toEqual(null);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
