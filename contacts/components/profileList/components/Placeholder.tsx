/**
 * Created by: Raj Meghpara
 * Date: 2022-01-18
 * Time: 12:25
 */

//libs
import { memo } from 'react';
import ContentTombstone from '@space/core/components/contentTombstone/ContentTombstone';
import { Box } from '@sprinklr/spaceweb/box';

const Placeholder = () => (
  <Box data-testId="profileListFormEditor">
    <ContentTombstone width="62rem" height={290}>
      <rect x="24" y="52" rx="6" ry="6" width="92%" height="32" />
      <rect x="24" y="28" rx="6" ry="6" width="25%" height="16" />
      <rect x="24" y="131" rx="6" ry="6" width="92%" height="32" />
      <rect x="24" y="107" rx="6" ry="6" width="25%" height="16" />
      <rect x="24" y="209" rx="6" ry="6" width="92%" height="74" />
      <rect x="24" y="185" rx="6" ry="6" width="25%" height="16" />
    </ContentTombstone>
  </Box>
);

const MemoizedPlaceholder = memo(Placeholder);

export { MemoizedPlaceholder as Placeholder };
