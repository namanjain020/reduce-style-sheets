//lib
import { useMemo, memo, useCallback, useEffect } from 'react';
import { validate } from 'spr-validation-schema/lib/validate';
import _noop from 'lodash/noop';
import vs from 'spr-validation-schema/lib/validationSchema';

//components
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { useForm, Form } from '@sprinklr/spaceweb-form';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sprinklr/spaceweb/modal';
import { Placeholder } from '../Placeholder';

//hooks
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';
import { useContactsTranslation } from '@/modules/contacts/i18n';

//utils
import { getFieldsConfig, getLayout } from '../../fieldsConfig';
import { getProfileOptions } from '../../utils';

//constants
import { FORM_FIELDS } from '../../constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import { MODAL_OVERRIDES } from './constants';

//types
import { ProfileListInfo } from '../../types';
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

type Props = {
  onClose: () => void;
  title: string;
  onSave: ({ profileIds, name, description }: { profileIds: Array<string>; name: string; description: string }) => void;
  isSaving: boolean;
} & Partial<{
  profileListInfo: ProfileListInfo;
  loading: boolean;
  profiles: Array<AudienceProfile>;
  showProfileSelector: boolean;
}>;

const ProfileListEditor = ({
  onClose,
  title,
  profileListInfo: { name, description } = EMPTY_OBJECT_READONLY,
  onSave,
  profiles = EMPTY_ARRAY_READONLY as unknown as Array<AudienceProfile>,
  loading,
  showProfileSelector = true,
  isSaving,
}: Props): JSX.Element => {
  const { __commonT } = useCommonTranslation();
  const { __contactsT } = useContactsTranslation();

  const initialValues = useMemo(
    () => ({
      [FORM_FIELDS.NAME]: name,
      [FORM_FIELDS.PROFILES]: getProfileOptions(profiles),
      [FORM_FIELDS.DESCRIPTION]: description,
    }),
    [name, profiles, description]
  );

  const fieldConfig = useMemo(
    () => getFieldsConfig(profiles, __commonT, __contactsT),
    [profiles, __commonT, __contactsT]
  );

  const onSubmit = useCallback(
    ({ values }: any) =>
      onSave({
        profileIds: values[FORM_FIELDS.PROFILES]?.map(({ id }) => id),
        name: values[FORM_FIELDS.NAME],
        description: values[FORM_FIELDS.DESCRIPTION],
      }),
    [onSave]
  );

  const validationSchema = useMemo(
    () =>
      vs.object({
        [FORM_FIELDS.NAME]: vs.string().required(__commonT("Hold on! This field can't be blank.")),
      }),
    [__commonT]
  );

  const initialLayout = useMemo(() => getLayout({ showProfileSelector }), [showProfileSelector]);

  const { errors, values, handleSubmit, layout, fieldConfigMap, handleAction, reset } = useForm({
    onSubmit,
    initialValues,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema),
    initialLayout,
    initialFieldConfigMap: fieldConfig,
  });

  useEffect(() => {
    reset({
      values: {
        [FORM_FIELDS.PROFILES]: getProfileOptions(profiles),
        [FORM_FIELDS.NAME]: name,
        [FORM_FIELDS.DESCRIPTION]: description,
      },
      fieldConfigMap: fieldConfig,
    });
  }, [profiles, reset, name, description, fieldConfig]);

  return (
    <Modal isOpen size="md" onClose={onClose} overrides={MODAL_OVERRIDES} animate={false}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {loading ? (
          <Placeholder />
        ) : (
          <Form
            className="py-7 px-6"
            layout={layout}
            fieldConfigMap={fieldConfigMap}
            values={values}
            errors={errors}
            onAction={handleAction}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Box className="flex flex-row justify-end">
          <Button variant="secondary" onClick={onClose} className="mr-3">
            {__commonT('Cancel')}
          </Button>
          <Button onClick={loading ? _noop : handleSubmit} disabled={loading} isLoading={isSaving}>
            {__commonT('Save')}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

const MemoProfileListEditor = memo(ProfileListEditor);
export { MemoProfileListEditor as ProfileListEditor };
