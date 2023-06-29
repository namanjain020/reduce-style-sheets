/**
 * Created by: Raj Meghpara
 * Date: 2021-09-22
 * Time: 22:13
 */

//libs
import { memo } from 'react';

//components
import { Stack } from '@sprinklr/spaceweb/stack';
import { Box } from '@sprinklr/spaceweb/box';
import ContentTombstone from '@space/core/components/contentTombstone/ContentTombstone';

//constants
import AppVariables from '../../../src/assets/appVariables.scss';

//types
import { ClassName } from '@sprinklr/spaceweb/types';

const ContactCardPlaceholder = ({ className }: { className?: string }): JSX.Element => (
  <Box data-testId="contactCardPlaceholder">
    <ContentTombstone width="100%" height={140} className={className}>
      <rect x="126" y="20" rx="8" ry="8" width="61%" height="12" />
      <circle cx="56" cy="56" r="40" />
      <rect x="126" y="56" rx="8" ry="8" width="49%" height="12" />
      <rect x="126" y="92" rx="8" ry="8" width="16%" height="12" />
      <rect x="238" y="92" rx="8" ry="8" width="16%" height="12" />
      <rect x="352" y="92" rx="8" ry="8" width="16%" height="12" />
    </ContentTombstone>
  </Box>
);

type Props = Partial<{ count: number; className: ClassName }>;

const ContactCardWithActionsPlaceholders = ({ count = 1, className }: Props): JSX.Element => (
  <Stack direction="vertical" gap={6} className={className}>
    {[...Array(count)].map((_count, index) => (
      <Stack
        direction="vertical"
        gap={0}
        className={['spr-ui-01 rounded-8 w-full', { width: AppVariables.engagementCardWidth }]}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <ContactCardPlaceholder />
        <ContentTombstone width="100%" height={55}>
          <rect x="126" y="23" rx="6" ry="6" width="12%" height="12" />
          <rect x="257" y="23" rx="6" ry="6" width="12%" height="12" />
          <rect x="434" y="13" rx="8" ry="8" width="13%" height="32" />
        </ContentTombstone>
      </Stack>
    ))}
  </Stack>
);

const MemoizedContactCardWithActionsPlaceholders = memo(ContactCardWithActionsPlaceholders);

export { MemoizedContactCardWithActionsPlaceholders as ContactCardWithActionsPlaceholders, ContactCardPlaceholder };
