//types
import { Overrides } from '@sprinklr/spaceweb/overrides';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

export const getCheckboxOverrides = (channel: SnType): Overrides => ({
  Root: {
    props: {
      'data-testid': `${channel}-selector`,
      className: 'flex flex-row items-center px-6 py-4',
    },
  },
  Checkmark: {
    props: { className: 'self-center mr-1' },
  },
});
