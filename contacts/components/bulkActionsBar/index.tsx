//libs
import dynamic from 'next/dynamic';

//components
import BulkActionsBarTombstone from '@sprinklr/modules/infra/components/bulkActionsBar/BulkActionsBarTombstone';

//constants
import { ENTITY_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';

//types
import { Props } from './BulkActionsBar';
import { ProfileListActionsHandler } from '../profileListActionsHandler';
import { ProfileSelection } from '../../types';

const BulkActionsBarComponent = dynamic<Props>(
  () => import(/* webpackChunkName: "contacts-bulk-actions-bar" */ './BulkActionsBar').then(mod => mod.BulkActionsBar),
  {
    loading: () => <BulkActionsBarTombstone pageKey="contacts" />,
  }
);

const BulkActionsBar = ({
  profileSelection,
  selectedFacets,
  searchQuery,
  onAction,
  totalProfilesCount,
  profiles,
  selectedTab,
}: Omit<Props, 'selectedProfilesCount'> & {
  searchQuery: string;
  profileSelection: ProfileSelection;
  selectedFacets: Spr.StringTMap<string[]>;
}): JSX.Element => {
  const selectedProfiles = profileSelection.entities;
  const excludedProfiles = profileSelection.entitiesToExclude;

  const selectedProfilesCount =
    profileSelection.type === ENTITY_SELECTION_TYPE.ALL
      ? totalProfilesCount - excludedProfiles.length
      : selectedProfiles.length;

  return (
    <ProfileListActionsHandler
      onAction={onAction}
      profileSelection={profileSelection}
      selectedFacets={selectedFacets}
      searchQuery={searchQuery}
      selectedProfilesCount={selectedProfilesCount}
      selectedTab={selectedTab}
    >
      {({ onAction: onProfileListAction }): JSX.Element => (
        <BulkActionsBarComponent
          onAction={onProfileListAction}
          profiles={profiles}
          selectedTab={selectedTab}
          totalProfilesCount={totalProfilesCount}
          selectedProfilesCount={selectedProfilesCount}
          profileSelection={profileSelection}
        />
      )}
    </ProfileListActionsHandler>
  );
};

export { BulkActionsBar };
