//libs
import { memo } from 'react';

//hooks
import { OnProfileListAction, useProfileListActionsHandler } from './hooks/useProfileListActionsHandler';

//components
import { ActionComponent } from './ActionComponent';

//types
import { OnAction } from '@/hooks/usePaginatedEntitySelection/usePaginatedEntitySelection';
import { ProfileSelection, Profile, ContactsType } from '@/modules/contacts/types';

type Props = {
  onAction: OnAction<Profile>;
  selectedFacets: Spr.StringTMap<string[]>;
  searchQuery: string;
  profileSelection: ProfileSelection;
  selectedProfilesCount: number;
  selectedTab: ContactsType;
  children: ({ onAction }: { onAction: OnProfileListAction }) => JSX.Element;
};

const ProfileListActionsHandler = ({
  onAction: onParentAction,
  searchQuery,
  selectedFacets,
  profileSelection,
  selectedProfilesCount,
  selectedTab,
  children,
}: Props): JSX.Element => {
  const { state, onAction } = useProfileListActionsHandler({
    onAction: onParentAction,
    profileSelection,
    searchQuery,
    selectedFacets,
    selectedProfilesCount,
    selectedTab,
  });

  return (
    <>
      {children({ onAction })}
      <ActionComponent overlayState={state} />
    </>
  );
};

export default memo(ProfileListActionsHandler);
