//libs
import { memo, useMemo, useCallback } from 'react';

//components
import { ProfileCard } from '@/modules/contacts/components/profileCard';
import { Box } from '@sprinklr/spaceweb/box';
import { VirtualizedListWithWindowScroll } from '@/components/virtualizedList';
import { ContactCardWithActionsPlaceholders } from '@/modules/contacts/components/placeholders/ContactCardWithActionsPlaceholders';

//utils
import { getAdaptedContactsSocialProfiles } from '@/modules/contacts/utils/getAdaptedContactsSocialProfiles';
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';

//hocs
import { withTransientState } from './WithTransientState';

//constants
import { PROFILE_CARD_VARIANTS } from '@/modules/contacts/components/profileCard/constants';

//types
import { Profile, ContactsType, ProfileSelection } from '@/modules/contacts/types';
import { ItemRenderer } from '@/components/virtualizedList/types';
import { OnAction } from '@/hooks/usePaginatedEntitySelection';
import { ENTITY_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';

const itemIdGetter = AudienceProfileEntity.getId;

type Props = {
  loading: boolean;
  contacts?: Profile[];
  selectedTab: ContactsType;
  isPaginating: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  selectedFacets: Spr.StringTMap<string[]>;
  profileSelection: ProfileSelection;
  onAction: OnAction<Profile>;
};

const ProfileCardsList = ({
  selectedTab,
  contacts: _contacts,
  loading,
  hasMore,
  fetchMore,
  isPaginating,
  selectedFacets,
  profileSelection,
  onAction,
}: Props): JSX.Element => {
  const actionParams = useMemo(() => ({ contactType: selectedTab }), [selectedTab]);

  const contacts = useMemo(
    () => getAdaptedContactsSocialProfiles({ contacts: _contacts, selectedFacets }),
    [_contacts, selectedFacets]
  );

  const getIsItemSelected = useCallback(
    (item: Profile): boolean => {
      const areAllProfilesSelected = profileSelection.type === ENTITY_SELECTION_TYPE.ALL;

      const selectedProfiles = profileSelection.entities;
      const excludedProfiles = profileSelection.entitiesToExclude;

      if (areAllProfilesSelected) {
        return !excludedProfiles.find(
          (excludedProfile: Profile) => itemIdGetter(excludedProfile) === itemIdGetter(item)
        );
      }

      return !!selectedProfiles.find(
        (includedProfile: Profile) => itemIdGetter(includedProfile) === itemIdGetter(item)
      );
    },
    [profileSelection]
  );

  const itemRenderer: ItemRenderer<Profile> = useCallback(
    params => {
      if (params.loading || !params.item) return <ContactCardWithActionsPlaceholders className="mb-6" />;

      return (
        <ProfileCard
          key={itemIdGetter(params.item)}
          profile={params.item}
          actionParams={actionParams}
          onAction={onAction}
          isSelected={getIsItemSelected(params.item)}
          variant={PROFILE_CARD_VARIANTS.LIST}
        />
      );
    },
    [actionParams, getIsItemSelected, onAction]
  );

  return (
    <Box className="contentFadeInEnter">
      <VirtualizedListWithWindowScroll<Profile, Spr.StringTMap<never>>
        items={contacts}
        loading={loading}
        isFetchingMore={isPaginating}
        hasMore={hasMore}
        fetchMore={fetchMore}
        itemIdGetter={itemIdGetter}
        itemRenderer={itemRenderer}
        width={536}
        defaultItemHeight={220}
      />
    </Box>
  );
};

const MemoizedProfileCardsList = memo(withTransientState<Props>(ProfileCardsList));

export { MemoizedProfileCardsList as ProfileCardsList };
