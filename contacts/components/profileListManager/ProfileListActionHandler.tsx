//libs
import { memo, ReactElement, useCallback } from 'react';

// constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

// contexts
import { withTabActions, WithTabActionsProps } from '@space/containers/pageTab/contexts';

// hooks
import { useProfileListManagerActions } from '@space/enterprise/pages/governance/profileList/manager/hooks/useProfileListManagerActions';
import { useButton } from '@sprinklr/modules/platform/buttonActions/useButton';
import { useAsyncActions } from '@space/core/hooks/useAsyncActions';
import { useDeleteClientProfileListMutation } from '@space/modules/profileList/hooks/useProfileListMutation/useDeleteClientProfileListMutation';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

//actionHandlers
import { actionHandlers, Params } from './actionHandlers';

// types
import { ModuleConfig } from '@space/modules/profileList/types';
import { OnAction } from '@space/core/types';

type Props = {
  moduleConfig: ModuleConfig;
  children: ({ onAction }) => ReactElement;
  onAction: OnAction;
} & WithTabActionsProps;

const ProfileListActionHandler = memo(({ moduleConfig, children, onAction: _onAction }: Props): ReactElement => {
  const { onAction: onProfileListManagerAction } = useProfileListManagerActions({
    moduleConfig,
    onAction: _onAction,
  });
  const [deleteClientProfileList] = useDeleteClientProfileListMutation();

  const { trigger } = useButton();
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const { onAction: onProfileListAction } = useAsyncActions<{}, Params>({
    initialState: EMPTY_OBJECT_READONLY,
    handlersMap: actionHandlers,
    params: {
      trigger,
      deleteClientProfileList,
      __contactsT,
      __commonT,
    },
  });

  const onAction = useCallback(
    (action: any) => {
      if (actionHandlers[action.templateId]) {
        onProfileListAction({
          type: action.templateId,
          payload: {
            ...action.payload,
            onSuccess: action.onSuccess,
          },
        });
      } else {
        onProfileListManagerAction(action);
      }
    },
    [onProfileListAction, onProfileListManagerAction]
  );

  return <>{children({ onAction })}</>;
});

export default withTabActions(ProfileListActionHandler);
