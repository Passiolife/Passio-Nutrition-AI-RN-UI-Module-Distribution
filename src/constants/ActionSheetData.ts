import type { ImageProps } from 'react-native';
import { ic_salad_blue_4x } from '../assets';

export interface ActionSheetType {
  icon: ImageProps['source'] | null;
  title: string;
  action?: () => void;
}

const moreMenuData: Array<ActionSheetType> = [
  { icon: require('../assets/ic_contacts_blue.png'), title: 'Profile' },
  {
    icon: require('../assets/ic_rebalance portfolio_blue.png'),
    title: 'My Progress',
  },
  {
    icon: require('../assets/ic_submit resume_blue.png'),
    title: 'Generate Report',
  },
  {
    icon: ic_salad_blue_4x,
    title: 'Recipes',
  },
];

const timeRangeData: Array<ActionSheetType> = [
  { icon: null, title: '1 Week Report' },
  {
    icon: null,
    title: '2 Week Report',
  },
  {
    icon: null,
    title: '1 Month Report',
  },
];

export { moreMenuData, timeRangeData };
