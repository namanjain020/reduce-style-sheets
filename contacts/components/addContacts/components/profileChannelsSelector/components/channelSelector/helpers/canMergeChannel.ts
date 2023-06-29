//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

//Channel can be merged when, only the channels corresponding to its merging permissioned channels are selected
export const canMergeChannels = ({
  channelsWithMergePermission,
  selectedChannels,
}: {
  channelsWithMergePermission: Array<SnType>;
  selectedChannels: Array<SnType>;
}): boolean =>
  selectedChannels.every((selectedChannel: SnType): boolean => channelsWithMergePermission.includes(selectedChannel));
