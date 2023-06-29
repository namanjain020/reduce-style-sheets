//lib
import { memo, useCallback, useMemo, useState } from 'react';

//components
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sprinklr/spaceweb/modal';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { PreviewCard } from '@/modules/contacts/components/PreviewCard';
import { Form, useForm } from '@sprinklr/spaceweb-form';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

//utils
import { validate } from 'spr-validation-schema/lib/validate';

//constants
import { INITIAL_VALUES, LAYOUT, VALIDATION_SCHEMA, getFieldConfigMap } from './formConfig';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';

//types
import { Profile } from '@/modules/contacts/types';

const MODAL_HEIGHT = 52;
const MODAL_OVERRIDES = {
  Dialog: {
    style: { height: `${MODAL_HEIGHT}rem` },
  },
};

export type Props = {
  onHide: () => void;
  profiles: Array<Profile>;
  handleMerge: ({
    successCallback,
    errorCallback,
    profileAttributes,
  }: {
    successCallback: () => void;
    errorCallback: () => void;
    profileAttributes: Spr.StringStringMap;
  }) => void;
};

const MergeProfilesModal = ({ onHide, handleMerge, profiles }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const [mergeProfilesInProgress, setMergeProfilesInProgress] = useState(false);

  const initialFieldConfigMap = useMemo(() => getFieldConfigMap(__contactsT), [__contactsT]);

  const onSubmit = useCallback(
    ({ values }: { values: Spr.StringStringMap }) => {
      setMergeProfilesInProgress(true);

      handleMerge({
        successCallback: () => setMergeProfilesInProgress(false),
        errorCallback: () => setMergeProfilesInProgress(false),
        profileAttributes: values,
      });
    },
    [handleMerge]
  );

  const { errors, values, handleSubmit, layout, fieldConfigMap, handleAction } = useForm({
    initialValues: INITIAL_VALUES,
    onSubmit,
    initialLayout: LAYOUT,
    initialFieldConfigMap,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, VALIDATION_SCHEMA),
  });

  return (
    <Modal isOpen onClose={onHide} size="md" overrides={MODAL_OVERRIDES}>
      <ModalHeader>{__contactsT('Merge Contacts')}</ModalHeader>

      <ModalBody className="w-full px-6 py-4">
        <Form
          className="mb-3"
          layout={layout}
          fieldConfigMap={fieldConfigMap}
          values={values}
          errors={errors}
          onAction={handleAction}
        />

        <Box className="spr-text-02 mb-1">{__contactsT('Profiles')}</Box>

        <Box className="spr-text-02 flex flex-col gap-4">
          {profiles.map(
            (profile: Profile): JSX.Element => (
              <PreviewCard profile={profile} key={AudienceProfileEntity.getId(profile)} />
            )
          )}
        </Box>
      </ModalBody>

      <ModalFooter className="p-6 flex flex-row justify-end gap-3">
        <Button onClick={onHide} variant="secondary">
          {__commonT('Cancel')}
        </Button>

        <Button onClick={handleSubmit} isLoading={mergeProfilesInProgress}>
          {__contactsT('Merge')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default memo(MergeProfilesModal);
