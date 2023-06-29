//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';

export type Props = {
  onAction: OnAction;
  selectedChannels: Array<SnType>;
  addContactInProgress: boolean;
  channelInputValues: ChannelInputValues;
  onClose: () => void;
};
