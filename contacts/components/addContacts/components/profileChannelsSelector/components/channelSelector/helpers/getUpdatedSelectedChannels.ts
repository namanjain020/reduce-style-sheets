//utils
import update from 'immutability-helper';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

// This function is used to toggle the selected channel -
// If it is already selected, it will filter it out from the selectedChannels array
// otherwise, it will add the channel in selectedChannels array
export const getUpdatedSelectedChannels = ({
  channelType,
  selectedChannels,
}: {
  channelType: SnType;
  selectedChannels: Array<SnType>;
}): Array<SnType> => {
  const index = selectedChannels.indexOf(channelType);

  return index === -1
    ? update(selectedChannels, { $push: [channelType] })
    : update(selectedChannels, { $splice: [[index, 1]] });
};
