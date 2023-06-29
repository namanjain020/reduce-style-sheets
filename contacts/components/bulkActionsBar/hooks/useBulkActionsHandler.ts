//libs
import { useCallback } from 'react';

//constants
import { BULK_ACTIONS } from '../constants';
import { ACTIONS as PROFILE_SELECTION_ACTIONS } from '@/hooks/usePaginatedEntitySelection';
import { PROFILE_LIST_ACTIONS } from '../../profileListActionsHandler/constants';

//types
import { Profile } from '@/modules/contacts/types';
import { Action, OnAction } from '@sprinklr/modules/infra/components/bulkActionsBar/types';
import type { OnProfileListAction } from '../../profileListActionsHandler/hooks/useProfileListActionsHandler';

const useBulkActionsHandler = ({
  onAction: onParentAction,
  profiles,
}: {
  onAction: OnProfileListAction;
  profiles: Array<Profile>;
}): OnAction =>
  useCallback<OnAction>(
    (action: Action): void => {
      switch (action.action) {
        case BULK_ACTIONS.SELECT_ALL: {
          onParentAction({
            type: PROFILE_SELECTION_ACTIONS.SELECT_ALL,
            payload: { entities: profiles },
          });

          break;
        }

        case BULK_ACTIONS.UNSELECT_ALL: {
          onParentAction({
            type: PROFILE_SELECTION_ACTIONS.UNSELECT_ALL,
          });

          break;
        }

        case BULK_ACTIONS.DELETE: {
          onParentAction({
            type: PROFILE_LIST_ACTIONS.OPEN_DELETE_CONFIRMATION_MODAL,
          });

          break;
        }

        case BULK_ACTIONS.MERGE: {
          onParentAction({
            type: PROFILE_LIST_ACTIONS.OPEN_MERGE_PROFILES_MODAL,
          });

          break;
        }

        case BULK_ACTIONS.ADD_TO_PROFILE_LISTS: {
          onParentAction({
            type: PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL,
          });

          break;
        }

        default:
          break;
      }
    },
    [onParentAction, profiles]
  );

export { useBulkActionsHandler };
