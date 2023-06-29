/* Created by Gaurav on 21/07/21 */

//lib
import { useMemo, memo, useEffect } from 'react';
import { useRouter } from 'next/router';

//components
import StandardEntityRecordManager, { BackButton } from '@/components/deprecatedStandardEntityRecordManager';
import { Box } from '@sprinklr/spaceweb/box';

//hooks
import { useConsentFormActions } from './hooks/useConsentFormActions';
import { useStyle } from '@sprinklr/spaceweb/style';
import { useFeatureUtils } from '@/contexts/featureUtils/useFeatureUtils';

//connectors
import { connectContextualNotification } from '@space/containers/contextualNotification';

//types
import { IntakeRequest } from './types';
import { Overrides } from '@/components/deprecatedStandardEntityRecordManager/types';

//constants
import { CONSENT_FORMS } from '@sprinklr/modules/infra/constants/assetClasses';
import { ACTION_TYPES } from '@space/enterprise/pages/marketing/intakeRequestForms/pages/intakeRequestFormsManager/actionHandler/constants';
import AppVariables from '../../../src/assets/appVariables.scss';

//resolvers
import { getEntityResolver } from '@space/modules/intakeRequest/entityWrapper';

//utils
import { getSearchRecords } from '@space/enterprise/pages/governance/intakeConsentForms/pages/intakeConsentFormsManager';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useIntakeRequestTranslation } from '@sprinklr/modules/intakeRequest/i18n';

const PAGE_SIZE = 50;

const PERMISSIONS_MAP = {
  [ACTION_TYPES.CREATE_INTAKE_REQUEST_FORM]: false,
  [ACTION_TYPES.EDIT_INTAKE_REQUEST_FORM]: false,
  [ACTION_TYPES.SHARE_INTAKE_REQUEST_FORM]: false,
};

const getOverrides = (onHide: () => void): Overrides<IntakeRequest> => ({
  Header: {
    props: {
      shouldShowFilterBar: false,
      overrides: {
        Title: () => <BackButton onBack={onHide} />,
      },
    },
  },
});

const ConsentForm = (): Spr.Null<JSX.Element> => {
  const featureUtils = useFeatureUtils();
  const {
    back,
    push,
    query: { menuId, subMenuId },
  } = useRouter();
  const { __contactsT } = useContactsTranslation();
  const { __intakeRequestT } = useIntakeRequestTranslation();
  const { onAction } = useConsentFormActions();
  const { css } = useStyle();
  const width = css({ width: AppVariables.workspaceWidth });
  const consentFormEnabled = featureUtils.isOn('CONSENT_FORMS_ENABLED', 'D');

  const overrides = useMemo(() => getOverrides(back), [back]);

  const config = useMemo(
    () => ({
      searchRecords: getSearchRecords(__intakeRequestT),
      ActionHandler: ({ children }) => children({ onAction }),
      permissions: PERMISSIONS_MAP,
      entityLabels: {
        singular: __contactsT('Consent Forms'),
        plural: __contactsT('Consent Forms'),
      },
      entityWrapper: getEntityResolver(__intakeRequestT),
      flavour: CONSENT_FORMS,
      pageSize: PAGE_SIZE,
    }),
    [__contactsT, __intakeRequestT, onAction]
  );

  if (!consentFormEnabled) {
    push(`/${menuId}/${subMenuId}/contacts`);

    return null;
  }

  return (
    <Box className={['h-screen', width]}>
      <StandardEntityRecordManager<IntakeRequest> config={config} overrides={overrides} />
    </Box>
  );
};

export default connectContextualNotification()(memo(ConsentForm));
