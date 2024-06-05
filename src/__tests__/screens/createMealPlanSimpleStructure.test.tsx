// @ts-nocheck
import type { MealPlan } from '../../models/MealPlan';
import type { IOSMealLabel, RecordEntity } from '../models/iOSMealLabel';

function createMealPlanDirectory(
  day: number,
  mealLabel: string,
  record: RecordEntity
): MealPlan {
  return {
    servingSize: record.servingSize,
    passioID: record.passioID,
    name: record.mealName,
    unitQuantity: record.unitQuantity.toString(),
    type: mealLabel.toString(),
    day: day,
  } as MealPlan;
}

function createSimpleMealPlanData(mealLabels: IOSMealLabel[]): MealPlan[] {
  return mealLabels
    .flatMap((item) =>
      item.meal?.flatMap((meal) =>
        meal.record?.flatMap((record) =>
          createMealPlanDirectory(item.day, meal.mealLabel, record)
        )
      )
    )
    .filter((item) => item !== undefined) as MealPlan[];
}

describe('convert meal plan data ios structure to simplify structure', () => {
  it('converted my plate meal p', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/iosMealPlanData.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted chronic-kidney-disease', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-chronic-kidney-disease.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted balanced', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-balanced.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted congestive-heart-failure', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-congestive-heart-failure.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted pescatarian', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-pescatarian.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted pre-diabetes', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-pre-diabetes.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });

  it('converted reach-healthy-weight&cure-obesity', async () => {
    const myPlateData = createSimpleMealPlanData(
      require('../assets/json/ios-reach-healthy-weight&cure-obesity.json')
    );
    expect(myPlateData).toMatchSnapshot();
  });
});
