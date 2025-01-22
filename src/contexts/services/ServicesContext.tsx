import React, { useContext } from 'react';
import type { AnalyticsService } from './AnalyticsService';
import type { NutritionDataService } from './NutritionDataService';
import defaultServices from './data';

export interface Services {
  dataService: NutritionDataService;
  analyticsService: AnalyticsService;
  otherService?: OtherService;
}
export interface OtherService {
  isLegacySearch?: () => Promise<void>;
}

export interface ExternalServices {
  dataService?: NutritionDataService;
  otherService?: OtherService;
  analyticsService?: AnalyticsService;
}

const ServicesContext = React.createContext({} as Services);

export const useServices = () => useContext(ServicesContext);

interface ServicesProviderProps extends React.PropsWithChildren {
  services?: ExternalServices;
}

export const ServicesProvider = ({
  services,
  children,
}: ServicesProviderProps) => (
  <ServicesContext.Provider value={{ ...defaultServices, ...services }}>
    {children}
  </ServicesContext.Provider>
);

//https://blog.testdouble.com/posts/2021-03-19-react-context-for-dependency-injection-not-state/
