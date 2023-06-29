/**
 * Created by: Raj Meghpara
 * Date: 2021-08-10
 * Time: 16:16
 */

//libs
import { useMemo, useCallback } from 'react';

//hooks
import { useForm, FieldConfigMap, Layout, Errors, Values } from '@sprinklr/spaceweb-form';
import { useCreateContact } from '@/modules/contacts/components/addContacts/hooks/useCreateContact';

//utils
import {
  getInitialValues,
  getValidationSchema,
} from '@/modules/contacts/components/addContacts/components/contactCreationForm/helpers';
import {
  getFieldConfigMap,
  getLayout,
} from '@/modules/contacts/components/addContacts/components/contactCreationForm/fieldsConfig';
import { validate } from 'spr-validation-schema/lib/validate';
import { getProfileCreationRequest } from '@/modules/contacts/components/addContacts/hooks/useCreateContact/utils/getProfileCreationRequest';

//types
import { FieldConfig } from '@/modules/contacts/components/addContacts/types';
import { OnAction } from '@space/core/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

//i18n
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

type Props = {
  fields: Array<FieldConfig>;
  channelInputValues: Partial<Record<SnType, string>>;
  onClose: () => void;
};

type Return = {
  layout: Layout;
  fieldConfigMap: FieldConfigMap;
  values: Values;
  errors: Errors;
  handleAction: OnAction;
  handleAddContact: () => void;
  loading: boolean;
};

const useContactCreation = ({ fields, channelInputValues, onClose }: Props): Return => {
  const { __commonT } = useCommonTranslation();

  const { createContact, loading: contactCreationInProgress } = useCreateContact({ onSuccessCallback: onClose });

  const validationSchema = useMemo(() => getValidationSchema(fields, __commonT), [fields, __commonT]);

  const initialLayout = useMemo(() => getLayout(fields), [fields]);

  const initialFieldConfigMap = useMemo(() => getFieldConfigMap(fields), [fields]);

  const initialValues = useMemo(() => getInitialValues(channelInputValues), [channelInputValues]);

  const onSubmit = useCallback(
    ({ values }: { values: Spr.StringStringMap }) =>
      createContact({
        variables: {
          addToContacts: true,
          profileCreationRequest: getProfileCreationRequest({
            profileAttributes: values,
            channelInputValues,
          }),
        },
      }),
    [channelInputValues, createContact]
  );

  const { errors, handleSubmit, values, layout, fieldConfigMap, handleAction } = useForm({
    onSubmit,
    initialValues,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema),
    initialLayout,
    initialFieldConfigMap,
  });

  return {
    layout,
    fieldConfigMap,
    values,
    errors,
    handleAction,
    handleAddContact: handleSubmit,
    loading: contactCreationInProgress,
  };
};

export { useContactCreation };
