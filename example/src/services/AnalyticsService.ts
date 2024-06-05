import type { AnalyticsService } from '@passiolife/nutrition-ai-ui-ux';

export const analyticsService: AnalyticsService = {
  logEvent(event: string) {
    console.log(`Analytics: ${event}`); // eslint-disable-line no-console
  },
};
