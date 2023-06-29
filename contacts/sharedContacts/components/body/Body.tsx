//libs
import { memo, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import _isEmpty from 'lodash/isEmpty';

//components
import { Box } from '@sprinklr/spaceweb/box';
import { ProfileCardsList } from '@/modules/contacts/components/profileCardsList';
import { BulkActionsBar } from '@/modules/contacts/components/bulkActionsBar';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//variables
import { selectedFacetsVar, searchQueryVar } from '@/modules/contacts/sharedContacts/reactiveVariables';

//hooks
import { useFetchPermissibleAccountCount } from '@/hooks/useFetchPermissibleAccountCount';
import { useSharedContactsProfiles } from '../../hooks/useSharedContactsProfiles';
import { ACTIONS as PROFILES_LIST_ACTIONS, usePaginatedEntitySelection } from '@/hooks/usePaginatedEntitySelection';

//constants
import { CONTACTS_TYPES } from '@/modules/contacts/constants';
import AppVariables from '../../../../src/assets/appVariables.scss';

//types
import { ENTITY_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';
import { Profile } from '@/modules/contacts/types';

const CLASS_NAME = { width: AppVariables.engagementCardWidth };

const Body = (): JSX.Element => {
  const { data, loading, error, fetchMore, isPaginating, refetch } = useSharedContactsProfiles();

  const selectedFacets = useReactiveVar(selectedFacetsVar);
  const searchQuery = useReactiveVar(searchQueryVar);

  useFetchPermissibleAccountCount();

  const {
    state: { entitySelection: profileSelection },
    onAction,
  } = usePaginatedEntitySelection<Profile>({
    entityIdGetter: AudienceProfileEntity.getId,
  });

  useEffect(() => {
    onAction({
      type: PROFILES_LIST_ACTIONS.UNSELECT_ALL,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should unselect all the contacts if filters/search keyword changes
  }, [onAction, searchQuery, selectedFacets]);

  const showBulkActions = !_isEmpty(profileSelection.entities) || profileSelection.type === ENTITY_SELECTION_TYPE.ALL;

  return (
    <Box className={CLASS_NAME}>
      <ProfileCardsList
        selectedTab={CONTACTS_TYPES.SHARED_CONTACTS}
        contacts={data?.profiles}
        loading={loading}
        hasMore={!!data?.hasMore}
        fetchMore={fetchMore}
        isPaginating={isPaginating}
        error={error}
        refetch={refetch}
        selectedFacets={selectedFacets}
        profileSelection={profileSelection}
        onAction={onAction}
      />

      {showBulkActions && !!data ? (
        <BulkActionsBar
          profileSelection={profileSelection}
          onAction={onAction}
          profiles={data.profiles}
          totalProfilesCount={data.totalFound}
          selectedFacets={selectedFacets}
          searchQuery={searchQuery}
          selectedTab={CONTACTS_TYPES.SHARED_CONTACTS}
        />
      ) : null}
    </Box>
  );
};

const MemoizedBody = memo(Body);

export { MemoizedBody as Body };
