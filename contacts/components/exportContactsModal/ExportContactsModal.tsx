// libraries
import { useMemo, memo, useCallback } from 'react';

// hooks
import { useForm, Form, UseFormArgs } from '@sprinklr/spaceweb-form';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useContactsTabs } from '@/modules/contacts/hooks/useContactsTabs';
import { useErrorTranslation } from '@sprinklr/modules/error/i18n';
import { useExportContacts } from '../../hooks/useExportContacts';

// utils
import { validate } from 'spr-validation-schema/lib/validate';

// components
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sprinklr/spaceweb/modal';
import { Button } from '@sprinklr/modules/infra/components/interactiveAtoms/Button';
import { Box } from '@sprinklr/spaceweb/box';

// helpers
import { getFieldConfigMap } from './helpers/getFieldConfigMap';
import { getValidationSchema } from './helpers/getValidationSchema';

// constants
import { LAYOUT, FIELD_IDS } from './constants';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

const INITIAL_VALUES = {
  [FIELD_IDS.CONTACT_TYPES]: EMPTY_ARRAY_READONLY,
};

const ExportContactsModal = ({ onClose }: { onClose: () => void }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __errorT } = useErrorTranslation();

  const { tabsMap } = useContactsTabs();

  const initialFieldConfigMap = useMemo(() => getFieldConfigMap(__contactsT, tabsMap), [__contactsT, tabsMap]);

  const validationSchema = useMemo(() => getValidationSchema(__errorT), [__errorT]);

  const [exportContacts, { loading }] = useExportContacts(onClose);

  const onSubmit = useCallback<UseFormArgs['onSubmit']>(
    ({ values: { contactTypes } }) => {
      exportContacts(contactTypes);
    },
    [exportContacts]
  );

  const { errors, fieldConfigMap, handleAction, values, layout, handleSubmit } = useForm({
    initialFieldConfigMap,
    initialLayout: LAYOUT,
    initialValues: INITIAL_VALUES,
    onSubmit,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema),
  });

  return (
    <Modal isOpen onClose={onClose}>
      <ModalHeader>
        <Box>{__contactsT('Export Contacts')}</Box>

        <Box className="typography-bl2 mt-1">
          {__contactsT('Export will trigger a notification once the file is ready to download')}
        </Box>
      </ModalHeader>

      <ModalBody className="p-6">
        <Form errors={errors} fieldConfigMap={fieldConfigMap} values={values} layout={layout} onAction={handleAction} />
      </ModalBody>

      <ModalFooter className="flex justify-end gap-2">
        <Button onClick={onClose} trackerEventId="@/exportContactsModal/cancel" variant="secondary">
          {__contactsT('Cancel')}
        </Button>

        <Button
          onClick={handleSubmit}
          trackerEventId="@/exportContactsModal/export"
          isLoading={loading}
          data-testid="export-contacts-button"
        >
          {__contactsT('Export')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const MemoizedExportContactsModal = memo(ExportContactsModal);

export { MemoizedExportContactsModal as ExportContactsModal };
