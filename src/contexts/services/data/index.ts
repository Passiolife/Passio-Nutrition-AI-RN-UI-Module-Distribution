import type { Services } from '../ServicesContext';
import { analyticsService } from './AnalyticsService';
import dataService from './DataService';

const defaultServices: Services = {
  dataService,
  analyticsService,
};

export default defaultServices;
