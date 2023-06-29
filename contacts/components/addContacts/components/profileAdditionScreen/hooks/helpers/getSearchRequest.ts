//builders
import FilterBuilder from '@sprinklr/modules/filters/FilterBuilder';

//constants
import {
  SN_TYPE_TO_INPUT_START_ENHANCER,
  CHANNEL_TYPE_TO_PROFILE_SEARCH_FILTER_GETTER,
} from '@/modules/contacts/components/addContacts/constants';
import { PROFILE, AssetClass } from '@sprinklr/modules/infra/constants/assetClasses';
import { OR, IN, AND } from '@sprinklr/modules/filters/constants';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

type SearchRequest = {
  filters: FilterBuilder;
  assetClass: AssetClass;
};

export const getSearchRequest = (channelInputValues: Partial<Record<SnType, string>>): SearchRequest => {
  const filters = new FilterBuilder().addFilterType(OR);

  Object.keys(channelInputValues).forEach((channelType: SnType) => {
    if (channelInputValues[channelType]) {
      const startEnhancer = SN_TYPE_TO_INPUT_START_ENHANCER[channelType] ?? '';

      filters.addFilter(
        new FilterBuilder()
          .addFilterType(AND)
          .addFilter(new FilterBuilder().addFilterType(IN).addField('SN_TYPE').addValues([channelType]))
          .addFilter(
            CHANNEL_TYPE_TO_PROFILE_SEARCH_FILTER_GETTER[channelType](channelInputValues[channelType]!, startEnhancer)
          )
      );
    }
  });

  return {
    filters,
    assetClass: PROFILE,
  };
};
