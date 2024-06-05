import React from 'react';
import services from './services';
import {
  BrandingProvider,
  NutritionNavigator,
  ServicesProvider,
  usePassioConfig,
} from '@passiolife/nutrition-ai-ui-ux';
import branding from './branding';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from './SplashScreen';
import { ENV_PASSIO_KEY } from '@env';

export default function App() {
  const { isReady } = usePassioConfig({ key: ENV_PASSIO_KEY });

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ServicesProvider services={services}>
      <BrandingProvider branding={branding}>
        <NavigationContainer>
          <NutritionNavigator />
        </NavigationContainer>
      </BrandingProvider>
    </ServicesProvider>
  );
}
