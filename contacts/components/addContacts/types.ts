/**
 * Created by: Raj Meghpara
 * Date: 2021-08-06
 * Time: 14:18
 */

//types
import type { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import type { FieldType } from 'spr-dynamic-form/lib/constants';
import { State as PhoneInputValue } from '@sprinklr/spaceweb/phone-input';

export type FieldConfig = {
  fieldName: string;
  displayName: string;
  fieldType: string;
  type: FieldType;
  required: boolean;
};

export type ChannelData = {
  id: SnType;
  mergingAllowedChannels: Array<SnType>;
};

export type ChannelsData = Array<ChannelData>;

export type ChannelInputValues = Partial<Record<SnType, string | PhoneInputValue>>;

export type OnAction = (action: Spr.Action) => void;

export type State = {
  selectedChannels: Array<SnType>;
  currentScreenIndex: number;
  channelInputValues: ChannelInputValues;
};
