// @ts-nocheck
import {
  allDaysDate,
  getLogToDate,
  mealLabelByDate,
} from '../../screens/scanning/utils';

describe('A user can log foods to a particular date and meal', () => {
  Date.now = jest.fn(() => new Date(2021, 8, 10, 14, 0, 0).valueOf());

  it('if date and meal pass as undefined', () => {
    const date = getLogToDate(undefined, undefined);
    const result = mealLabelByDate(date);
    expect(result).toEqual('lunch');
  });

  it('if selected day is not today and no meal is selected ("All Day") is selected,', () => {
    const date = new Date(2021, 8, 21, 0, 0, 0);
    const result = allDaysDate(date);
    const expectDate = new Date(2021, 8, 21, 14, 0, 0);
    expect(result).toEqual(expectDate);
  });

  it('if date pass of today and meal pass as undefined', () => {
    const date = new Date(2021, 8, 10, 14, 0, 0);
    date.setTime(Date.now());
    const resultDate = getLogToDate(date, undefined);
    const resultMealLog = mealLabelByDate(resultDate);
    expect(resultDate).toEqual(date);
    expect(resultMealLog).toEqual('lunch');
  });

  it('if date pass of today of 17:00 and meal pass as undefined', () => {
    const date = new Date(2021, 8, 10, 17, 0, 0);
    const resultDate = getLogToDate(date, undefined);
    const resultMealLog = mealLabelByDate(resultDate);
    expect(resultDate).toEqual(date);
    expect(resultMealLog).toEqual('dinner');
  });

  it('if date pass of today of 5:00 and meal pass as undefined', () => {
    const date = new Date(2021, 8, 10, 5, 0, 0);
    const resultDate = getLogToDate(date, undefined);
    const resultMealLog = mealLabelByDate(resultDate);
    expect(resultDate).toEqual(date);
    expect(resultMealLog).toEqual('breakfast');
  });

  it('if the meal log date is not today, and pass meal as  breakfast to get breakfast time (8:00)', () => {
    const date = new Date(2021, 5, 8, 0, 0, 0);
    const expectDate = new Date(2021, 5, 8, 8, 0, 0);
    const result = getLogToDate(date, 'breakfast');
    expect(result).toEqual(expectDate);
  });

  it('if the meal log date is not today, and pass meal as dinner to get dinner time (19:00)', () => {
    const date = new Date(2021, 5, 8, 0, 0, 0);
    const expectDate = new Date(2021, 5, 8, 19, 0, 0);
    const result = getLogToDate(date, 'dinner');
    expect(result).toEqual(expectDate);
  });

  it('if the meal log date is not today, and pass meal as lunch to get lunch time (x12:00)', () => {
    const date = new Date(2021, 5, 8, 0, 0, 0);
    const expectDate = new Date(2021, 5, 8, 12, 0, 0);
    const result = getLogToDate(date, 'lunch');
    expect(result).toEqual(expectDate);
  });

  it('if the meal log date is not today, and pass meal as snack to get snack time (15:00)', () => {
    const date = new Date(2021, 5, 8, 0, 0, 0);
    const expectDate = new Date(2021, 5, 8, 15, 0, 0);
    const result = getLogToDate(date, 'snack');
    expect(result).toEqual(expectDate);
  });
});
