/**
 * Created by: Raj Meghpara
 * Date: 2021-08-08
 * Time: 20:34
 */

//types
import type { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import type { ChannelsData, OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';

export type HandleChannelSwitch = (channel: string) => void;

export type HandleProfileIdChange = (keyword: string) => void;

export type ProfileAdditionScreenProps = {
  onAction: OnAction;
  channelsData: ChannelsData;
  addContactInProgress: boolean;
  channelInputValues: ChannelInputValues;
  onClose: () => void;
};

export type BodyProps = {
  channel: SnType;
  onHandleChange: HandleProfileIdChange;
  profileCreationAllowed: boolean;
  channelInputValues: ChannelInputValues;
  warningMessage: string;
  inputPlaceholder: string;
  inputStartEnhancer?: string;
};

export type FooterProps = Pick<
  ProfileAdditionScreenProps,
  'addContactInProgress' | 'onAction' | 'channelInputValues'
> & {
  profileCreationAllowed: boolean;
  channel: SnType;
};
