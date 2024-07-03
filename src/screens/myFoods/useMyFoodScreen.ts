import { useBranding } from '../../contexts';

export const useMyFoodScreen = () => {
  const branding = useBranding();

  return {
    branding,
  };
};
