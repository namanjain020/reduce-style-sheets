/**
 * Created by: Raj Meghpara
 * Date: 2021-08-06
 * Time: 14:31
 */

//libs
import { memo, useMemo } from 'react';

//components
import { Form } from '@sprinklr/spaceweb-form';
import { ContactCreationFormLayout, SLOT_NAMES } from './components/contactCreationFormLayout';
import { Footer } from './components/Footer';
import CssTransition from '@space/core/components/cssTransition';

//hoc
import { withTransientState } from './components/withTransientState';

//utils
import { getAdaptedChannelInputValues } from '@/modules/contacts/utils/getAdaptedChannelInputValues';

//hooks
import { useContactCreation } from './hooks/useContactCreation';
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { ContactScreenProps } from '../types';
import { FieldConfig } from '@/modules/contacts/components/addContacts/types';

type Props = Pick<ContactScreenProps, 'onAction' | 'channelInputValues' | 'onClose'> & {
  fields: Array<FieldConfig>;
};

const ContactCreationForm = ({ onAction, channelInputValues, fields, onClose }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const adaptedChannelInputValues = useMemo(
    () => getAdaptedChannelInputValues(channelInputValues),
    [channelInputValues]
  );

  const {
    layout,
    fieldConfigMap,
    values,
    errors,
    handleAction,
    handleAddContact,
    loading: createContactInProgress,
  } = useContactCreation({
    fields,
    channelInputValues: adaptedChannelInputValues,
    onClose,
  });

  const primaryButtonParams = useMemo(
    () => ({
      label: __contactsT('Add Contact'),
      onClick: handleAddContact,
      isLoading: createContactInProgress,
    }),
    [__contactsT, createContactInProgress, handleAddContact]
  );

  return (
    <ContactCreationFormLayout title={__contactsT('Create Contact')}>
      <ContactCreationFormLayout.Slot name={SLOT_NAMES.BODY}>
        <CssTransition appear>
          <Form
            layout={layout}
            fieldConfigMap={fieldConfigMap}
            values={values}
            errors={errors}
            onAction={handleAction}
            data-testid="contactCreationForm"
          />
        </CssTransition>
      </ContactCreationFormLayout.Slot>

      <ContactCreationFormLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Footer onAction={onAction} primaryButtonParams={primaryButtonParams} />
      </ContactCreationFormLayout.Slot>
    </ContactCreationFormLayout>
  );
};

export default memo(withTransientState<Props>(ContactCreationForm));
