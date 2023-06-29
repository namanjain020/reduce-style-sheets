//libs
import { useCallback, memo } from 'react';
import Portal from 'react-overlays/lib/Portal';

//components
import {
  BulkActionBar as BulkActionBarLayout,
  SLOT_NAMES,
} from '@sprinklr/modules/infra/components/bulkActionsBar/layout/BulkActionBar';
import { BulkActions } from '@sprinklr/modules/infra/components/bulkActionsBar/BulkActions';
import { SelectionLabel } from '@sprinklr/modules/infra/components/bulkActionsBar/layout/SelectionLabel';
import BulkActionsBarTombstone from '@sprinklr/modules/infra/components/bulkActionsBar/BulkActionsBarTombstone';
import { Suspense } from '@sprinklr/modules/infra/components/Suspense';
import { StackItem } from '@sprinklr/spaceweb/stack';
import { Loader } from '@sprinklr/spaceweb/loader';

//constants
import { ACTIONS as PROFILES_LIST_ACTIONS } from '@/hooks/usePaginatedEntitySelection';

//constants
import { ICON_MAP } from './constants';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useBulkActions } from './hooks/useBulkActions';
import { useBulkActionsHandler } from './hooks/useBulkActionsHandler';
import { useFetchChannelsAllowedToBeMerged } from '@/modules/contacts/hooks/useFetchChannelsAllowedToBeMerged';

//types
import { Profile, ContactsType, ProfileSelection } from '@/modules/contacts/types';
import { OnProfileListAction } from '../profileListActionsHandler/hooks/useProfileListActionsHandler';

export type Props = {
  onAction: OnProfileListAction;
  totalProfilesCount: number;
  profiles: Array<Profile>;
  selectedTab: ContactsType;
  selectedProfilesCount: number;
  profileSelection: ProfileSelection;
};

const BulkActionsBar = ({
  onAction,
  profiles,
  selectedTab,
  totalProfilesCount,
  selectedProfilesCount,
  profileSelection,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { channelsAllowedToBeMerged, loading } = useFetchChannelsAllowedToBeMerged();

  const areAllProfilesSelected = selectedProfilesCount === totalProfilesCount;

  const actions = useBulkActions({
    areAllProfilesSelected,
    selectedTab,
    selectedProfilesCount,
    profileSelection,
    channelsAllowedToBeMerged,
  });

  const onBulkAction = useBulkActionsHandler({ onAction, profiles });

  const hideBulkActionsBar = useCallback(
    (): void => onAction({ type: PROFILES_LIST_ACTIONS.UNSELECT_ALL }),
    [onAction]
  );

  return (
    <Portal container={document.body}>
      <Suspense fallback={<BulkActionsBarTombstone pageKey="contacts" />} boundaryName="BulkActionBar">
        <BulkActionBarLayout pageKey="contacts" className="fixed">
          <BulkActionBarLayout.Slot name={SLOT_NAMES.SELECTION_LABEL}>
            <SelectionLabel
              label={
                selectedProfilesCount > 1
                  ? __contactsT('{{selectedProfilesCount}} Contacts Selected', { selectedProfilesCount })
                  : __contactsT('1 Contact Selected')
              }
              onClose={hideBulkActionsBar}
            />
          </BulkActionBarLayout.Slot>

          <BulkActionBarLayout.Slot name={SLOT_NAMES.ACTIONS}>
            <BulkActions actions={actions} onAction={onBulkAction} iconMap={ICON_MAP} />
          </BulkActionBarLayout.Slot>

          <BulkActionBarLayout.Slot name={SLOT_NAMES.LOADING}>
            {loading ? (
              <StackItem className="flex items-center">
                <Loader variant="clip" size={20} />
              </StackItem>
            ) : null}
          </BulkActionBarLayout.Slot>
        </BulkActionBarLayout>
      </Suspense>
    </Portal>
  );
};

const MemoizedBulkActionsBar = memo(BulkActionsBar);

export { MemoizedBulkActionsBar as BulkActionsBar };
