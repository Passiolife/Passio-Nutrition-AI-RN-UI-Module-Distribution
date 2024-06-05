export enum ActionPlanType {
  balanced = 'BALANCED',
  type2Diabetes = 'TYPE_2_DIALETES',
  chronicKidneyDisease = 'CHRONIC_KIDNEY_DISEASE',
  congestiveHeartFailure = 'CONGESTIVE_HEART_FAILUTRE',
  cureObesity = 'CURE_OBESITY',
  vegetarian = 'VEGETARIAN',
  none = 'NONE',
}

export interface ActionPlan {
  actionPlanType: ActionPlanType;
  name: string;
  icon: number;
  info: string;
  disclaimner: string;
}
