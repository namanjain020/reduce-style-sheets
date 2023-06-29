//types
import { ContactsType, TabsMap } from '@/modules/contacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { ContactsTranslationFn } from '@/modules/contacts/i18n';

//constants
import { CONTACTS_TYPES } from '@/modules/contacts/constants';

const NUMBER_OF_PROFILES_ALLOWED_TO_MERGE = 2;

export const getMergeActionTooltip = ({
  selectedTab,
  selectedProfilesCount,
  channelsAllowedToBeMerged,
  __contactsT,
  tabsMap,
}: {
  selectedTab: ContactsType;
  selectedProfilesCount: number;
  channelsAllowedToBeMerged: Array<SnType>;
  __contactsT: ContactsTranslationFn;
  tabsMap: TabsMap;
}): string => {
  if (selectedTab !== CONTACTS_TYPES.MY_CONTACTS) {
    return __contactsT('You cannot merge {{selectedTabLabel}}.', {
      selectedTabLabel: tabsMap[selectedTab]?.label,
    });
  }

  if (selectedProfilesCount !== NUMBER_OF_PROFILES_ALLOWED_TO_MERGE) {
    return __contactsT('Only two profiles can be merged together at once.');
  }

  const totalChannels = channelsAllowedToBeMerged.length;

  if (totalChannels === 1) {
    return __contactsT('Only {{channel}} contacts can be merged together.', {
      channel: channelsAllowedToBeMerged[0],
    });
  }

  return __contactsT('Only {{commaSeparatedValues}} and {{lastValue}} contacts can be merged together.', {
    commaSeparatedValues: channelsAllowedToBeMerged.slice(0, totalChannels - 1).join(', '),
    lastValue: channelsAllowedToBeMerged[totalChannels - 1],
  });
};
