//libs
import { memo } from 'react';

//constants
import { OVERLAY_TYPES } from './constants';

//components
import { DeleteConfirmationModal } from './components/deleteConfirmationModal';
import { MergeProfilesModal } from './components/mergeProfilesModal';
import { AddToProfileListsModal } from './components/addToProfileListsModal';
import { CreateProfileList as CreateProfileListModal } from '@/modules/contacts/components/profileList/createProfileList';

//types
import type { ActionState } from './hooks/useProfileListActionsHandler';

type Props = {
  overlayState: ActionState;
};

const ActionComponent = ({ overlayState }: Props): Spr.Null<JSX.Element> => {
  switch (overlayState?.overlayType) {
    case OVERLAY_TYPES.DELETE_CONFIRMATION_MODAL:
      return <DeleteConfirmationModal {...overlayState.overlayProps} />;

    case OVERLAY_TYPES.MERGE_PROFILES_MODAL:
      return <MergeProfilesModal {...overlayState.overlayProps} />;

    case OVERLAY_TYPES.ADD_TO_PROFILE_LISTS_MODAL:
      return <AddToProfileListsModal {...overlayState.overlayProps} />;

    case OVERLAY_TYPES.CREATE_PROFILE_LIST_MODAL:
      return <CreateProfileListModal {...overlayState.overlayProps} />;

    default:
      return null;
  }
};

const MemoizedActionComponent = memo(ActionComponent);

export { MemoizedActionComponent as ActionComponent };
