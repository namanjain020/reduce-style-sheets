/**
 * Created by: Raj Meghpara
 * Date: 2021-08-10
 * Time: 19:05
 */

//libs
import { memo } from 'react';

//components
import ChannelIcon from '@sprinklr/modules/infra/components/channelIcon/ChannelIcon';
import { Stack, StackItem } from '@sprinklr/spaceweb/stack';
import { Box } from '@sprinklr/spaceweb/box';

//constants
import { VARIANTS } from '@sprinklr/modules/infra/components/channelIcon/constants';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import baseSnTypes from 'spr-base/lib/constants/snTypes';

type Props = {
  channel: SnType;
};

const ChannelIconWithLabel = memo(
  ({ channel }: Props): JSX.Element => (
    <Stack direction="horizontal" gap={2} className="items-center">
      <StackItem shrink>
        <ChannelIcon channel={channel} size={32} className="flex items-center" variant={VARIANTS.COLOURED_CIRCLE} />
      </StackItem>
      <Box $as="span" className="text-16">
        {baseSnTypes[channel].name}
      </Box>
    </Stack>
  )
);

export { ChannelIconWithLabel };
