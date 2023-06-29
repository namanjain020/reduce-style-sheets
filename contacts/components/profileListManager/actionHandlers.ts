//libs
import type { ExecutionResult } from 'graphql';

//constants
import { PROFILE_LIST_ACTION_TYPES } from '@space/modules/profileList/constants';
import { BUTTON_ACTIONS as CONTACT_BUTTON_ACTIONS } from '@/modules/contacts/components/ButtonActionsProvider';
import { BUTTON_ACTIONS } from '@/contexts/buttonActions/actionTemplates';

//utils
import {
  onSuccess as onSuccessNotification,
  onError as onErrorNotification,
} from '@space/refluxActions/NotificationActions';

//types
import type { HandlersMap } from '@space/core/hooks/useAsyncActions';
import { I18nextTFunction } from '@sprinklr/modules/sprI18Next';
import type { UseButton } from '@sprinklr/modules/platform/buttonActions/types';

export type Params = {
  trigger: UseButton['trigger'];
  deleteClientProfileList: (id: number) => Promise<ExecutionResult<boolean>>;
  __contactsT: I18nextTFunction;
  __commonT: I18nextTFunction;
};

export const actionHandlers: HandlersMap<{}, Params> = {
  [PROFILE_LIST_ACTION_TYPES.ADD_CLIENT_PROFILE_LIST]: ({ payload: { onSuccess } }, { params: { trigger } }) => {
    trigger({
      templateId: CONTACT_BUTTON_ACTIONS.OPEN_CREATE_PROFILE_LIST_MODAL,
      id: 'OPEN_CREATE_PROFILE_LIST_MODAL',
      payload: {
        onSuccess,
      },
    });
  },
  [PROFILE_LIST_ACTION_TYPES.EDIT_CLIENT_PROFILE_LIST]: (
    { payload: { onSuccess, actionContext } },
    { params: { trigger } }
  ) => {
    const selectedProfileList = actionContext.currentRecord;

    trigger({
      templateId: CONTACT_BUTTON_ACTIONS.OPEN_EDIT_PROFILE_LIST_MODAL,
      id: 'OPEN_EDIT_PROFILE_LIST_MODAL',
      payload: {
        onSuccess,
        id: selectedProfileList.id,
        profileListInfo: {
          name: selectedProfileList.name,
          description: selectedProfileList.description,
        },
      },
    });
  },
  [PROFILE_LIST_ACTION_TYPES.DELETE_CLIENT_PROFILE_LIST]: (
    { payload: { onSuccess, actionContext } },
    { params: { trigger, deleteClientProfileList, __commonT, __contactsT } }
  ) => {
    trigger({
      templateId: BUTTON_ACTIONS.OPEN_CONFIRMATION_MODAL,
      id: 'OPEN_CONFIRMATION_MODAL',
      payload: {
        confirmationBtnLabel: __commonT('Delete'),
        headerLabel: __contactsT('Delete Contact List'),
        confirmationMessage: __contactsT(
          'All data related to the contact list will be deleted. Do you want me to proceed?'
        ),
        onConfirmation: onHide => {
          deleteClientProfileList(actionContext.currentRecord.id)
            .then(() => {
              onSuccessNotification(__contactsT('I have deleted the contact list.'));
              onSuccess();
            })
            .catch(() => {
              onErrorNotification(__contactsT('I failed to delete the contact list.'));
            });
          onHide();
        },
      },
    });
  },
};
