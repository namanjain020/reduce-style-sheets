//libs
import { useMemo, memo, useCallback } from 'react';
import _isEmpty from 'lodash/isEmpty';

//components
import { StatefulTooltip } from '@sprinklr/spaceweb/tooltip';
import { Box } from '@sprinklr/spaceweb/box';
import { Checkbox } from '@sprinklr/spaceweb/checkbox';
import { ChannelIconWithLabel } from '../../../ChannelIconWithLabel';

//helpers
import { canMergeChannels } from './helpers/canMergeChannel';
import { getChannelSelectionDisabledReason } from './helpers/getChannelSelectionDisabledReason';
import { getUpdatedSelectedChannels } from './helpers/getUpdatedSelectedChannels';
import { getCheckboxOverrides } from './helpers/getCheckboxOverrides';

//constants
import { ACTION_TYPES } from '@/modules/contacts/components/addContacts/constants';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { ContactScreenProps } from '../../../types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { ChannelData } from '@/modules/contacts/components/addContacts/types';

type Props = {
  selectedChannels: Array<SnType>;
  channelData: ChannelData;
} & Pick<ContactScreenProps, 'onAction'>;

const ChannelSelector = ({ selectedChannels, onAction, channelData }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { id: channelType, mergingAllowedChannels } = channelData;

  const disabled =
    !selectedChannels.includes(channelType) &&
    !canMergeChannels({
      channelsWithMergePermission: mergingAllowedChannels,
      selectedChannels,
    });

  const selectionDisabledReason = useMemo(
    () => getChannelSelectionDisabledReason({ selectedChannels, __contactsT }),
    [selectedChannels, __contactsT]
  );

  const handleSelectChannel = useCallback(() => {
    const updatedSelectedChannels = getUpdatedSelectedChannels({
      channelType,
      selectedChannels,
    });

    onAction({ type: ACTION_TYPES.SELECT_CHANNELS, payload: { selectedChannels: updatedSelectedChannels } });
  }, [channelType, onAction, selectedChannels]);

  const renderChannelSelector = useCallback(
    () => (
      <Box className={['spr-border-01 w-full', `${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`]}>
        <Checkbox
          checked={selectedChannels.includes(channelType)}
          disabled={disabled}
          onChange={handleSelectChannel}
          overrides={getCheckboxOverrides(channelType)}
        >
          <ChannelIconWithLabel channel={channelType} />
        </Checkbox>
      </Box>
    ),
    [channelType, disabled, handleSelectChannel, selectedChannels]
  );

  return disabled ? (
    <StatefulTooltip content={selectionDisabledReason} placement="top" ignoreBoundary>
      {renderChannelSelector()}
    </StatefulTooltip>
  ) : (
    renderChannelSelector()
  );
};

export default memo(ChannelSelector);
