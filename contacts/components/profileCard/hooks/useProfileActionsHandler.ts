/* Created by Gaurav on 09/01/2023 */

//lib
import { useCallback, ReactNode, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { useMutation, useApolloClient, ApolloCache, FetchResult } from '@apollo/client';

//helpers
import { actionHandlers } from '../actionHandlersMap';

//hooks
import { useAsyncActions, HandlersMap } from '@space/core/hooks/useAsyncActions';
import { useThirdPane, OpenThirdPane, CloseThirdPane } from '@/hooks/useThirdPane';
import { useButton } from '@sprinklr/modules/platform/buttonActions/useButton';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { I18nextTFunction, useCommonTranslation } from '@sprinklr/modules/sprI18Next';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';
import { useMacroTranslation, MacroTranslationFn } from '@sprinklr/modules/macro/i18n';
import { useAudienceProfileLazyQuery } from '@space/modules/profile/hooks/useAudienceProfileQuery';
import { useContactsTabs } from '@/modules/contacts/hooks/useContactsTabs';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import { DELETE_CONTACT_MUTATION } from '@/modules/contacts/queries';

//types
import type { UseButton } from '@sprinklr/modules/platform/buttonActions/types';
import { Profile, ContactsType, TabsMap } from '@/modules/contacts/types';
import { onAction as ActionHandler } from '@/components/engagementEntity/universalCaseMessage/types';
import { Action } from '@/types/engagementEntity';
import { MessageActionModalProps } from '@/components/messageActionModals/types';
import { SnackbarContextType } from '@sprinklr/modules/infra/components/snackbar';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

type State = {
  messageActionModalProps: MessageActionModalProps;
};

type Params = {
  profile: Profile;
  socialProfile: SocialProfile;
  dispatch: Dispatch<AnyAction>;
  openThirdPane: OpenThirdPane;
  closeThirdPane: CloseThirdPane;
  trigger: UseButton['trigger'];
  __commonT: I18nextTFunction;
  __contactsT: I18nextTFunction;
  __macroT: MacroTranslationFn;
  macroActions: Array<Action>;
  onError: SnackbarContextType['onError'];
  onSuccess: SnackbarContextType['onSuccess'];
  deleteContact: (options: {
    variables: { universalProfileIds: string[] };
  }) => Promise<FetchResult<{ dstDeleteContact: boolean }>>;
  fetchAudienceProfile: (entityId: string) => void;
  cache: ApolloCache<Spr.StringAnyMap>;
  tabsMap: TabsMap;
  contactType: ContactsType;
};

type UseProfileActionsHandler = (props: {
  profile: Profile;
  macroActions: Array<Action>;
  socialProfile: SocialProfile;
  contactType: ContactsType;
}) => {
  onAction: ActionHandler;
};

const useProfileActionsHandler: UseProfileActionsHandler = ({ profile, macroActions, socialProfile, contactType }) => {
  const { __commonT } = useCommonTranslation();
  const { __contactsT } = useContactsTranslation();
  const { __macroT } = useMacroTranslation();
  const { cache } = useApolloClient();

  const { tabsMap } = useContactsTabs();

  const dispatch = useDispatch();
  const { trigger } = useButton();
  const { onError, onSuccess } = useSnackbarNotifications();
  const [fetchAudienceProfile] = useAudienceProfileLazyQuery();

  const [deleteContact] = useMutation<{ dstDeleteContact: boolean }>(DELETE_CONTACT_MUTATION);

  const { openThirdPane, closeThirdPane } = useThirdPane();

  const { onAction } = useAsyncActions<State, Params>({
    initialState: EMPTY_OBJECT_READONLY,
    handlersMap: actionHandlers as HandlersMap<State, Params>,
    params: {
      profile,
      socialProfile,
      dispatch,
      openThirdPane,
      trigger,
      __commonT,
      __contactsT,
      macroActions,
      __macroT,
      onError,
      fetchAudienceProfile,
      closeThirdPane,
      onSuccess,
      cache,
      deleteContact,
      tabsMap,
      contactType,
    },
  });

  const triggerAction = useCallback(
    (action: Action, target?: ReactNode) => {
      const actionType = action.action;

      return onAction({
        type: actionType,
        payload: {
          action,
          actionTypeParams: { target },
        },
      });
    },
    [onAction]
  );

  const handleAction = useCallback(
    (action: Action, event?: SyntheticEvent, target?: ReactNode) => {
      const targetEl = target || event?.target;

      return Promise.resolve(triggerAction(action, targetEl));
    },
    [triggerAction]
  );

  return {
    onAction: handleAction,
  };
};

export { useProfileActionsHandler };
