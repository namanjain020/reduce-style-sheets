//types
import type { I18nextTFunction } from '@sprinklr/modules/sprI18Next';

export const getSortOptions = (__commonT: I18nextTFunction): Array<{ label: string; value: string; id: string }> => [
  { label: __commonT('Modified Time'), value: 'MODIFIED_TIME', id: 'MODIFIED_TIME' },
];
