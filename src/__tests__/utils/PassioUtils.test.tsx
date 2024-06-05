// @ts-nocheck
import type { MealLabel } from '@passiolife/nutrition-ai-ui-ux';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { createFoodLogFromPassioIDAttributes } from '../../screens/scanning/utils';
import uuid from 'react-native-uuid';

describe('createFoodLogFromPassioIDAttributes', () => {
  it('correctly translates the data to a FoodLog', () => {
    const attributes: PassioIDAttributes = require('../assets/json/passio_sdk_result.json');
    const date = new Date('2021-04-11T14:48:31.146+00:00');
    const meal: MealLabel = 'breakfast';
    const foodLog = createFoodLogFromPassioIDAttributes(attributes, meal, date);
    expect(foodLog.name).toEqual(attributes.name);
    expect(foodLog.passioID).toEqual(attributes.passioID);
    expect(foodLog.eventTimestamp).toEqual(date.toISOString());
    expect(uuid.validate(foodLog.uuid)).toEqual(true);
    expect(foodLog.meal).toEqual(meal);
    expect(foodLog.imageName).toEqual(attributes.imageName);
    expect(foodLog.entityType).toEqual(attributes.entityType);
  });
});
