/* Created by Gaurav on 26/07/21 */

//types
import { IntakeRequest as TypeIntakeRequest } from '@space/modules/intakeRequest/types';
import { User } from '@sprinklr/modules/user/types';
import { EntityResolver as TypeEntityResolver } from '@space/modules/intakeRequest/entityWrapper/types';

//constants
import { ACTION_TYPES } from '@space/enterprise/pages/marketing/intakeRequestForms/pages/intakeRequestFormsManager/actionHandler/constants';

interface BaseIntakeRequestFormAction {
  action: string;
  payload: {
    actionContext: {
      currentUser: User;
      currentRecord: TypeIntakeRequest;
    };
  };
  onSuccess: () => void;
}

interface ViewFormAction extends BaseIntakeRequestFormAction {
  templateId: typeof ACTION_TYPES.VIEW_INTAKE_REQUEST_FORM;
}

interface CopyLinkAction extends BaseIntakeRequestFormAction {
  templateId: typeof ACTION_TYPES.COPY_LINK_INTAKE_REQUEST_FORM;
}

export type Action = ViewFormAction | CopyLinkAction;

export interface IntakeRequest extends TypeIntakeRequest {
  _lookup?: Spr.StringAnyMap;
}

export type SearchRecordsResponse = {
  results: IntakeRequest[];
  hasMore: boolean;
  totalCount: number;
};

export type EntityResolver = TypeEntityResolver;
