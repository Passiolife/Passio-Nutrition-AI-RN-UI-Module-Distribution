import type { ComputedWeight } from './ComputedWeight';
import type { ServingSize } from './ServingSize';
import type { ServingUnit } from './ServingUnit';

export interface ServingInfo {
  selectedUnit: string;
  selectedQuantity: number;
  servingSizes: ServingSize[];
  servingUnits: ServingUnit[];
  computedWeight?: ComputedWeight;
}
