/* Created by Gaurav on 26/07/21 */

//constants
import { ACTION_TYPES } from '@space/enterprise/pages/marketing/intakeRequestForms/pages/intakeRequestFormsManager/actionHandler/constants';

//types
import { SprEnv } from '@/types/sprEnv';
import { HandlersMap } from '@space/core/hooks/useAsyncActions';

const generateFormShareUrl = ({ sprEnv, globalRequestId }: { sprEnv: SprEnv; globalRequestId?: string }) =>
  `https://forms-${sprEnv.getEnv()}.sprinklr.com/forms/${globalRequestId}`;

export const actionHandlersMap: HandlersMap<
  Spr.StringAnyMap,
  { copyToClipboard: (url: string) => void; sprEnv: SprEnv }
> = {
  [ACTION_TYPES.VIEW_INTAKE_REQUEST_FORM]: ({ payload }, { params: { sprEnv } }) =>
    window.open(
      generateFormShareUrl({ sprEnv, globalRequestId: payload.actionContext?.currentRecord?.globalRequestId })
    ),
  [ACTION_TYPES.COPY_LINK_INTAKE_REQUEST_FORM]: ({ payload }, { params: { copyToClipboard, sprEnv } }) =>
    copyToClipboard(
      generateFormShareUrl({ sprEnv, globalRequestId: payload.actionContext?.currentRecord?.globalRequestId })
    ),
};
