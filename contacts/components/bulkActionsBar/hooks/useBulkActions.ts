//libs
import { useMemo } from 'react';

//rules
import '@/factory/actionsFactory/actions/contactActions/contactActionRules';

//hooks
import { useContactsTabs } from '@/modules/contacts/hooks/useContactsTabs';
import { useContactsTranslation } from '@/modules/contacts/i18n';

//utils
import AclStore from '@space/refluxStores/AclStore';

//constants
import { BULK_ACTIONS } from '../constants';
import { CONTACTS_TYPES } from '@/modules/contacts/constants';

//helpers
import { areSelectedProfilesMergeable } from '../helpers/areSelectedProfilesMergeable';
import { getMergeActionTooltip } from '../helpers/getMergeActionTooltip';

//types
import { Action } from '@sprinklr/modules/infra/components/bulkActionsBar/types';
import { ContactsType, ProfileSelection } from '@/modules/contacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

const NUMBER_OF_PROFILES_ALLOWED_TO_MERGE = 2;

export const useBulkActions = ({
  areAllProfilesSelected,
  selectedTab,
  selectedProfilesCount,
  profileSelection,
  channelsAllowedToBeMerged,
}: {
  areAllProfilesSelected: boolean;
  selectedTab: ContactsType;
  selectedProfilesCount: number;
  profileSelection: ProfileSelection;
  channelsAllowedToBeMerged: Array<SnType>;
}): Action[] => {
  const { __contactsT } = useContactsTranslation();

  const { tabsMap } = useContactsTabs();

  const isDeleteActionDisabled = !AclStore.can('profile:delete', { contactType: selectedTab });

  const isMergeActionDisabled =
    selectedTab !== CONTACTS_TYPES.MY_CONTACTS ||
    selectedProfilesCount !== NUMBER_OF_PROFILES_ALLOWED_TO_MERGE ||
    !areSelectedProfilesMergeable({
      profiles: profileSelection.entities,
      channelsAllowedToBeMerged,
    });

  const mergeActionTooltip = useMemo(
    () =>
      getMergeActionTooltip({
        selectedTab,
        selectedProfilesCount,
        channelsAllowedToBeMerged,
        __contactsT,
        tabsMap,
      }),
    [__contactsT, channelsAllowedToBeMerged, selectedProfilesCount, selectedTab, tabsMap]
  );

  return useMemo(
    () => [
      {
        name: __contactsT('Delete'),
        icon: 'delete',
        action: BULK_ACTIONS.DELETE,
        items: undefined,
        disabled: isDeleteActionDisabled,
        tooltip: isDeleteActionDisabled
          ? __contactsT('Contacts removal is not supported for {{selectedTabLabel}}', {
              selectedTabLabel: tabsMap[selectedTab]?.label,
            })
          : undefined,
        trackerEventId: '@contacts/bulkActionsBar/Delete',
      },

      {
        name: __contactsT('Merge'),
        icon: 'merge',
        action: BULK_ACTIONS.MERGE,
        items: undefined,
        disabled: isMergeActionDisabled,
        tooltip: isMergeActionDisabled ? mergeActionTooltip : '',
        trackerEventId: '@contacts/bulkActionsBar/Merge',
      },

      {
        name: __contactsT('Add to Contact Lists'),
        icon: 'contact',
        action: BULK_ACTIONS.ADD_TO_PROFILE_LISTS,
        items: undefined,
        trackerEventId: '@contacts/bulkActionsBar/AddToProfileLists',
      },

      areAllProfilesSelected
        ? {
            name: __contactsT('Clear Selection'),
            icon: 'selectAll',
            action: BULK_ACTIONS.UNSELECT_ALL,
            items: undefined,
            trackerEventId: '@contacts/bulkActionsBar/ClearSelection',
          }
        : {
            name: __contactsT('Select All'),
            icon: 'selectAll',
            action: BULK_ACTIONS.SELECT_ALL,
            items: undefined,
            trackerEventId: '@contacts/bulkActionsBar/SelectAll',
          },
    ],

    [
      __contactsT,
      areAllProfilesSelected,
      isDeleteActionDisabled,
      isMergeActionDisabled,
      mergeActionTooltip,
      selectedTab,
      tabsMap,
    ]
  );
};
