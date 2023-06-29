/**
 * Created by: Raj Meghpara
 * Date: 2021-08-09
 * Time: 14:16
 */

//libs
import _isEmpty from 'lodash/isEmpty';

//utils
import { insertIf } from '@sprinklr/modules/infra/utils/array';
import { getShifuFilter } from '@/utils/general';
import { insertIf as insertIfObj } from '@sprinklr/modules/infra/utils/object';

//constants
import {
  PROFILE_HANDLE_SEARCH_SUPPORTING_CHANNELS,
  SN_TYPE_TO_INPUT_START_ENHANCER,
  CHANNEL_TYPE_TO_PROFILE_SEARCH_FILTER_GETTER,
} from '@/modules/contacts/components/addContacts/constants';
import ASSET_CLASS from '@sprinklr/modules/infra/constants/assetClasses';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { Filter } from '@sprinklr/modules/filters/types/filter';

export type ProfileFetchPayload = {
  filters: Filter[];
  assetClass: string;
  query?: string;
};

export const getFetchProfilePayload = (channelType: SnType, searchedKeyword: string): ProfileFetchPayload => {
  const startEnhancer = SN_TYPE_TO_INPUT_START_ENHANCER[channelType];
  const profileSearchFilter = CHANNEL_TYPE_TO_PROFILE_SEARCH_FILTER_GETTER[channelType](searchedKeyword, startEnhancer);

  const filters = [
    getShifuFilter('SN_TYPE', [channelType]),
    ...insertIf(!_isEmpty(profileSearchFilter), profileSearchFilter),
  ];

  return {
    filters,
    assetClass: ASSET_CLASS.PROFILE,
    ...insertIfObj(PROFILE_HANDLE_SEARCH_SUPPORTING_CHANNELS.has(channelType), {
      query: SN_TYPE_TO_INPUT_START_ENHANCER[channelType] + searchedKeyword,
    }),
  };
};
