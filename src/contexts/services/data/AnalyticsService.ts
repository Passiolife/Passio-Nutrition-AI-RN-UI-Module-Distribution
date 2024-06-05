import type { AnalyticsService } from '../AnalyticsService';

export const analyticsService: AnalyticsService = {
  logEvent(event: string) {
    console.log(`Analytics: ${event}`); // eslint-disable-line no-console
  },
};
