import type { MealLabel } from '../models';
import { currentTimeStamp, isToday } from '.';

export function getLogToDate(
  date: Date | undefined,
  meal: MealLabel | undefined
): Date {
  if (date === undefined) {
    date = currentTimeStamp();
  }
  if (meal === undefined || isToday(date)) {
    return date;
  } else {
    return defaultDateForMealLabel(meal, date);
  }
}
export function getMealLog(date: Date, meal: MealLabel | undefined): MealLabel {
  return meal === undefined ? mealLabelByDate(date) : meal;
}

export function mealLabelByDate(date: Date): MealLabel {
  try {
    const hours = date.getHours();
    const minute = date.getMinutes() / 10;
    const hoursWithMinutes = Number(
      hours + '.' + minute.toString().replaceAll('.', '')
    );
    if (hoursWithMinutes >= 5.3 && hoursWithMinutes <= 10.3) {
      return 'breakfast';
    } else if (hoursWithMinutes >= 11.3 && hoursWithMinutes <= 14) {
      return 'lunch';
    } else if (hoursWithMinutes >= 17 && hoursWithMinutes <= 21) {
      return 'dinner';
    } else {
      return 'snack';
    }
  } catch (err) {
    if (isBreakfastTime(date)) {
      return 'breakfast';
    } else if (isLunchTime(date)) {
      return 'lunch';
    } else if (isDinnerTime(date)) {
      return 'dinner';
    } else {
      return 'snack';
    }
  }
}

function isBreakfastTime(date: Date): Boolean {
  return isBetweenDateRange(date, 4, 10);
}

function isLunchTime(date: Date): Boolean {
  return isBetweenDateRange(date, 11, 14);
}

function isDinnerTime(date: Date): Boolean {
  return isBetweenDateRange(date, 17, 21);
}

export function isBetweenDateRange(
  date: Date,
  startTime: number,
  endTime: number
): Boolean {
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime,
    0,
    0
  );
  const endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endTime,
    0,
    0
  );

  return date >= startDate && date <= endDate;
}

export function defaultDateForMealLabel(meal: MealLabel, date: Date): Date {
  if (meal === 'breakfast') {
    date.setHours(8, 0, 0, 0);
  } else if (meal === 'lunch') {
    date.setHours(12, 0, 0, 0);
  } else if (meal === 'snack') {
    date.setHours(15, 0, 0, 0);
  } else if (meal === 'dinner') {
    date.setHours(19, 0, 0, 0);
  } else {
    return date;
  }
  return date;
}

export function allDaysDate(date: Date): Date {
  const today = currentTimeStamp();
  date.setHours(today.getHours(), today.getMinutes(), 0o0, 0o0);
  return date;
}
