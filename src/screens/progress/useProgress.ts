import { useState } from 'react';

export type ProgressTab = 'Macro' | 'Micro';

export function useProgress() {
  const [tab, updateTab] = useState<ProgressTab>('Macro');

  const onSelectTab = (item: ProgressTab) => {
    updateTab(item);
  };

  return {
    tab,
    onSelectTab,
  };
}
