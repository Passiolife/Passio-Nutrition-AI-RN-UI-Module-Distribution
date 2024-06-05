export enum UnitSystem {
  IMPERIAL = 'imperial',
  METRIC = 'metric',
}

export type LengthUnitSetting = 'Feet, Inch' | 'Meter';
export type WeightUnitSetting = 'Lbs' | 'Kgs';
export type OgMlUnitSetting = 'oz' | 'ml';

export const WeightUnitSettingToUnitSystem: Record<
  WeightUnitSetting,
  UnitSystem
> = {
  Lbs: UnitSystem.IMPERIAL,
  Kgs: UnitSystem.METRIC,
};

export const LengthUnitSettingToUnitSystem: Record<
  LengthUnitSetting,
  UnitSystem
> = {
  'Feet, Inch': UnitSystem.IMPERIAL,
  'Meter': UnitSystem.METRIC,
};

export const LengthUnitSystemToUnitSetting: Record<
  UnitSystem,
  LengthUnitSetting
> = {
  [UnitSystem.IMPERIAL]: 'Feet, Inch',
  [UnitSystem.METRIC]: 'Meter',
};
export const WeightUnitSystemToUnitSetting: Record<
  UnitSystem,
  WeightUnitSetting
> = {
  [UnitSystem.IMPERIAL]: 'Lbs',
  [UnitSystem.METRIC]: 'Kgs',
};

export const OgMlUnitSystemToUnitSetting: Record<UnitSystem, OgMlUnitSetting> =
  {
    [UnitSystem.IMPERIAL]: 'oz',
    [UnitSystem.METRIC]: 'ml',
  };
