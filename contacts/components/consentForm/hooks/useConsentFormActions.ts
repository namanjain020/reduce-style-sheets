/* Created by Gaurav on 26/07/21 */

//hooks
import useCopyToClipboard from '@space/core/hooks/useCopyToClipboard';
import { useAsyncActions } from '@space/core/hooks/useAsyncActions';
import { useSprEnv } from '@/contexts/sprEnv/useSprEnv';

//types
import { Action } from '../types';
import { SprEnv } from '@/types/sprEnv';
import { ActionHandlerOnAction } from '@sprinklr/modules/recordManager/legacy/types';

//actions
import { actionHandlersMap } from '../actionHandlersMap';

export const useConsentFormActions = (): { onAction: ActionHandlerOnAction } => {
  const sprEnv = useSprEnv();
  const copyToClipboard = useCopyToClipboard();

  const { onAction } = useAsyncActions<Spr.StringAnyMap, { copyToClipboard: (url: string) => void; sprEnv: SprEnv }>({
    initialState: {},
    handlersMap: actionHandlersMap,
    params: { copyToClipboard, sprEnv },
  });

  const handleAction = (action: Action) => onAction({ type: action.templateId, payload: action.payload });

  return {
    onAction: handleAction,
  };
};
