import { useBranding } from '../../contexts';

export const useFoodCreator = () => {
  const branding = useBranding();

  return {
    branding,
  };
};
