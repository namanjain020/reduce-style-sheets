/**
 * Created by: Raj Meghpara
 * Date: 2021-07-26
 * Time: 19:16
 */

//libs
import { memo } from 'react';

//components
import { SingleChannelProfileAddition } from './variants/singleChannelProfileAddition';
import { MultiChannelsProfileAddition } from './variants/multiChannelsProfileAddition';

//types
import { ContactScreenProps } from '../types';

const ProfileAdditionScreen = ({
  selectedChannels,
  onAction,
  channelInputValues,
  addContactInProgress,
  onClose,
}: ContactScreenProps): JSX.Element => {
  const Component = selectedChannels.length > 1 ? MultiChannelsProfileAddition : SingleChannelProfileAddition;

  return (
    <Component
      channelInputValues={channelInputValues}
      onAction={onAction}
      addContactInProgress={addContactInProgress}
      onClose={onClose}
      selectedChannels={selectedChannels}
    />
  );
};

export default memo(ProfileAdditionScreen);

export { ProfileAdditionScreen as __testProfileAdditionScreen };
