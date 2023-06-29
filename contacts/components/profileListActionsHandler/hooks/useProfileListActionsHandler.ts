//libs
import { useCallback, useState } from 'react';

//constants
import { PROFILE_LIST_ACTIONS, OVERLAY_TYPES } from '../constants';
import { PROFILE_LIST_MUTATION_ACTIONS } from '@/modules/contacts/hooks/useProfileListMutation/constants';
import { ENTITY_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';
import EMPTY_ARR_READ_ONLY from '@sprinklr/modules/infra/constants/emptyArray';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//hooks
import { useProfileListMutation } from '@/modules/contacts/hooks/useProfileListMutation/useProfileListMutation';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { Action as BaseAction, OnAction as BaseOnAction } from '@sprinklr/modules/infra/types';
import { Profile, ProfileSelection, ContactsType } from '@/modules/contacts/types';
import {
  OnAction as OnParentAction,
  Action as EntitySelectionAction,
  ACTIONS as PROFILE_SELECTION_ACTIONS,
} from '@/hooks/usePaginatedEntitySelection/usePaginatedEntitySelection';
import { ProfileList } from '@space/modules/profileList/types';
import type { Props as DeleteConfirmationModalProps } from '../components/deleteConfirmationModal/DeleteConfirmationModal';
import type { Props as MergeProfilesModalProps } from '../components/mergeProfilesModal/MergeProfilesModal';
import type { Props as AddToProfileListsModalProps } from '../components/addToProfileListsModal/AddToProfileListsModal';
import type { Props as CreateProfileListModalProps } from '@/modules/contacts/components/profileList/createProfileList/CreateProfileList';

export type ActionState = Spr.Undefined<
  | {
      overlayType: OVERLAY_TYPES.DELETE_CONFIRMATION_MODAL;
      overlayProps: DeleteConfirmationModalProps;
    }
  | {
      overlayType: OVERLAY_TYPES.MERGE_PROFILES_MODAL;
      overlayProps: MergeProfilesModalProps;
    }
  | {
      overlayType: OVERLAY_TYPES.ADD_TO_PROFILE_LISTS_MODAL;
      overlayProps: AddToProfileListsModalProps;
    }
  | {
      overlayType: OVERLAY_TYPES.CREATE_PROFILE_LIST_MODAL;
      overlayProps: CreateProfileListModalProps;
    }
>;

type ProfileListAction =
  | EntitySelectionAction<Profile>
  | BaseAction<PROFILE_LIST_ACTIONS.OPEN_DELETE_CONFIRMATION_MODAL>
  | BaseAction<PROFILE_LIST_ACTIONS.OPEN_MERGE_PROFILES_MODAL>
  | BaseAction<PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL>
  | BaseAction<PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL, { profileListIds: Array<string> }>
  | BaseAction<
      PROFILE_LIST_ACTIONS.OPEN_CREATE_PROFILE_LIST_MODAL,
      {
        onHide: () => void;
        onSuccess: (profileList: ProfileList) => void;
      }
    >;

export type OnProfileListAction = BaseOnAction<void, ProfileListAction>;

const useProfileListActionsHandler = ({
  onAction: onParentAction,
  profileSelection,
  searchQuery,
  selectedFacets,
  selectedProfilesCount,
  selectedTab,
}: {
  onAction: OnParentAction<Profile>;
  profileSelection: ProfileSelection;
  searchQuery: string;
  selectedFacets: Spr.StringTMap<string[]>;
  selectedProfilesCount: number;
  selectedTab: ContactsType;
}): { onAction: OnProfileListAction; state: ActionState } => {
  const onProfileListMutation = useProfileListMutation({ selectedTab });

  const { __contactsT } = useContactsTranslation();

  const { onSuccess: onSuccessNotification, onError: onErrorNotification } = useSnackbarNotifications();

  const [overlayState, setOverlayState] = useState<ActionState>(undefined);

  const hideBulkActionsBar = useCallback(
    () =>
      onParentAction({
        type: PROFILE_SELECTION_ACTIONS.UNSELECT_ALL,
      }),
    [onParentAction]
  );

  const onAction = useCallback<OnProfileListAction>(
    action => {
      switch (action.type) {
        case PROFILE_LIST_ACTIONS.OPEN_DELETE_CONFIRMATION_MODAL: {
          setOverlayState({
            overlayType: OVERLAY_TYPES.DELETE_CONFIRMATION_MODAL,
            overlayProps: {
              onHide: () => setOverlayState(undefined),

              handleDeletion: ({
                successCallback,
                errorCallback,
              }: {
                successCallback: () => void;
                errorCallback: () => void;
              }) =>
                profileSelection.type === ENTITY_SELECTION_TYPE.ALL
                  ? onProfileListMutation({
                      type: PROFILE_LIST_MUTATION_ACTIONS.REMOVE,
                      payload: {
                        selectionType: ENTITY_SELECTION_TYPE.ALL,
                        searchQuery,
                        selectedFacets,
                        profileIdsToExclude: profileSelection.entitiesToExclude.map(AudienceProfileEntity.getId),
                        onCompleted: () => {
                          onSuccessNotification({
                            message: __contactsT(
                              'We have received the request to remove {{selectedProfilesCount}} contacts. We will notify you once this is completed.',
                              { selectedProfilesCount }
                            ),
                          });

                          successCallback();
                          hideBulkActionsBar();
                        },

                        onError: () => {
                          onErrorNotification({
                            message: __contactsT(
                              'Unable to process the request for removing {{selectedProfilesCount}} selected contacts. Please try again.',
                              { selectedProfilesCount }
                            ),
                          });

                          errorCallback();
                        },
                      },
                    })
                  : onProfileListMutation({
                      type: PROFILE_LIST_MUTATION_ACTIONS.REMOVE,
                      payload: {
                        selectionType: ENTITY_SELECTION_TYPE.ENTITIES,
                        profileIds: profileSelection.entities.map(AudienceProfileEntity.getId),
                        onCompleted: () => {
                          onSuccessNotification({
                            message: __contactsT('I’ve successfully removed the selected contacts.'),
                          });

                          successCallback();
                          hideBulkActionsBar();
                        },

                        onError: () => {
                          onErrorNotification({
                            message: __contactsT('I couldn’t remove the selected contacts.'),
                          });

                          errorCallback();
                        },
                      },
                    }),
            },
          });

          break;
        }

        case PROFILE_LIST_ACTIONS.OPEN_MERGE_PROFILES_MODAL: {
          setOverlayState({
            overlayType: OVERLAY_TYPES.MERGE_PROFILES_MODAL,
            overlayProps: {
              onHide: () => setOverlayState(undefined),
              profiles: profileSelection.entities,

              handleMerge: ({
                successCallback,
                errorCallback,
                profileAttributes,
              }: {
                successCallback: () => void;
                errorCallback: () => void;
                profileAttributes: Spr.StringStringMap;
              }) =>
                onProfileListMutation({
                  type: PROFILE_LIST_MUTATION_ACTIONS.MERGE,
                  payload: {
                    profileIds: profileSelection.entities.map(AudienceProfileEntity.getId),
                    profileAttributes,
                    onCompleted: () => {
                      onSuccessNotification({
                        message: __contactsT('I’ve successfully merged the selected profiles.'),
                      });

                      successCallback();
                      hideBulkActionsBar();
                    },
                    onError: () => {
                      onErrorNotification({
                        message: __contactsT('I couldn’t merge the selected profiles.'),
                      });

                      errorCallback();
                    },
                  },
                }),
            },
          });

          break;
        }

        case PROFILE_LIST_ACTIONS.OPEN_ADD_TO_PROFILE_LISTS_MODAL: {
          const profileListIds = 'payload' in action ? action.payload.profileListIds : EMPTY_ARR_READ_ONLY;

          setOverlayState({
            overlayType: OVERLAY_TYPES.ADD_TO_PROFILE_LISTS_MODAL,
            overlayProps: {
              onHide: () => setOverlayState(undefined),
              profileListIds,

              onAction,

              handleAddition: ({
                successCallback,
                errorCallback,
                contactListIds,
              }: {
                successCallback: () => void;
                errorCallback: () => void;
                contactListIds: Array<string>;
              }) =>
                profileSelection.type === ENTITY_SELECTION_TYPE.ALL
                  ? onProfileListMutation({
                      type: PROFILE_LIST_MUTATION_ACTIONS.ADD_TO_PROFILE_LISTS,
                      payload: {
                        selectionType: ENTITY_SELECTION_TYPE.ALL,
                        searchQuery,
                        selectedFacets,
                        contactListIds,

                        profileIdsToExclude: profileSelection.entitiesToExclude.map(AudienceProfileEntity.getId),

                        onCompleted: () => {
                          onSuccessNotification({
                            message: __contactsT(
                              'We have received the request to add {{selectedProfilesCount}} contacts to the selected contact list. We will notify you once this is completed.',
                              { selectedProfilesCount }
                            ),
                          });

                          successCallback();
                          hideBulkActionsBar();
                        },

                        onError: () => {
                          onErrorNotification({
                            message: __contactsT(
                              'We were unable to process your request to add {{selectedProfilesCount}} contacts to the selected contact lists. Please try again.',
                              { selectedProfilesCount }
                            ),
                          });

                          errorCallback();
                        },
                      },
                    })
                  : onProfileListMutation({
                      type: PROFILE_LIST_MUTATION_ACTIONS.ADD_TO_PROFILE_LISTS,
                      payload: {
                        selectionType: ENTITY_SELECTION_TYPE.ENTITIES,

                        profileIds: profileSelection.entities.map(AudienceProfileEntity.getId),

                        contactListIds,

                        onCompleted: () => {
                          onSuccessNotification({
                            message: __contactsT(
                              'I’ve successfully added {{selectedProfilesCount}} contacts to the selected contact lists.',
                              {
                                selectedProfilesCount,
                              }
                            ),
                          });

                          successCallback();
                          hideBulkActionsBar();
                        },

                        onError: () => {
                          onErrorNotification({
                            message: __contactsT(
                              'I’ve failed to add the {{selectedProfilesCount}} contacts to the selected contact lists.',
                              {
                                selectedProfilesCount,
                              }
                            ),
                          });

                          errorCallback();
                        },
                      },
                    }),
            },
          });

          break;
        }

        case PROFILE_LIST_ACTIONS.OPEN_CREATE_PROFILE_LIST_MODAL: {
          const { onHide, onSuccess } = action.payload;

          setOverlayState({
            overlayType: OVERLAY_TYPES.CREATE_PROFILE_LIST_MODAL,
            overlayProps: {
              onHide,
              onSuccess,
              showProfileSelector: false,
            },
          });

          break;
        }

        default:
          onParentAction(action);

          break;
      }
    },
    [
      __contactsT,
      hideBulkActionsBar,
      onErrorNotification,
      onParentAction,
      onProfileListMutation,
      onSuccessNotification,
      profileSelection.entities,
      profileSelection.entitiesToExclude,
      profileSelection.type,
      searchQuery,
      selectedFacets,
      selectedProfilesCount,
    ]
  );

  return { onAction, state: overlayState };
};

export { useProfileListActionsHandler };
