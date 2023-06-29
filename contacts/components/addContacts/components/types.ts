/**
 * Created by: Raj Meghpara
 * Date: 2021-08-08
 * Time: 12:51
 */

//types
import { ApolloError } from '@apollo/client';
import { ChannelsData, ChannelInputValues, OnAction } from '../types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

export type ContactScreenProps = {
  channelsData: ChannelsData;
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetchChannelsData: () => void;
  onAction: OnAction;
  selectedChannels: Array<SnType>;
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  onClose: () => void;
};
