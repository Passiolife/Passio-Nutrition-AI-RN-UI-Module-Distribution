import type { CustomFood } from './CustomFood';
import type { QuickResult } from './QuickResult';

export interface BarcodeCustomResult extends QuickResult {
  customFood?: CustomFood;
}
