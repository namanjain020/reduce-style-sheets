//libs
import { memo, useMemo, useCallback } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { useKey } from 'react-use';

//components
import { Box } from '@sprinklr/spaceweb/box';
import CssTransition from '@space/core/components/cssTransition';
import { Form, useForm, FORM_CHANGE_ACTION } from '@sprinklr/spaceweb-form';

//utils
import { validate } from 'spr-validation-schema/lib/validate';
import { getLayout, getFieldsConfig } from './helpers/formFields';
import { getValidationSchema } from './helpers/getValidationSchema';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useErrorTranslation } from '@sprinklr/modules/error/i18n';

//constants
import { ACTION_TYPES } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { ChannelInputValues, OnAction } from '@/modules/contacts/components/addContacts/types';

type Props = {
  channels: Array<SnType>;
  channelInputValues: ChannelInputValues;
  onAction: OnAction;
};

const Input = ({ channels, onAction, channelInputValues }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __errorT } = useErrorTranslation();

  const onSubmit = useCallback(
    ({ values }: { values: ChannelInputValues }): void =>
      onAction({
        type: ACTION_TYPES.CHANGE_CHANNEL_INPUT_VALUES,
        payload: {
          channelInputValues: values,
        },
      }),
    [onAction]
  );

  const initialFieldConfigMap = useMemo(
    () =>
      getFieldsConfig({
        channels,
      }),
    [channels]
  );

  const initialLayout = useMemo(() => getLayout(channels), [channels]);

  const validationSchema = useMemo(() => getValidationSchema({ channels, __errorT }), [__errorT, channels]);

  const {
    errors,
    handleSubmit,
    values,
    layout,
    fieldConfigMap,
    handleAction: _handleAction,
  } = useForm({
    onSubmit,
    validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema),
    initialLayout,
    initialValues: channelInputValues,
    initialFieldConfigMap,
  });

  useKey('Enter', handleSubmit);

  const handleAction = useCallback(
    (action: Spr.Action): void => {
      _handleAction(action);

      // If the value in the input changes, we want to reset `channelInputValues` to an empty object. To prevent
      // `onAction` from being called multiple times as the user is typing, we've added the `isEmpty` check.
      if (action.type === FORM_CHANGE_ACTION && !_isEmpty(channelInputValues)) {
        onAction({
          type: ACTION_TYPES.CHANGE_CHANNEL_INPUT_VALUES,
          payload: { channelInputValues: EMPTY_OBJECT_READONLY },
        });
      }
    },
    [_handleAction, channelInputValues, onAction]
  );

  return (
    <Box className="flex flex-col" data-testid="profileAdditionMultiChannelInputForm">
      <Box className="mb-2 text-14 font-400" $as="span">
        {__contactsT('Add Contact Details')}
      </Box>

      <Form
        layout={layout}
        fieldConfigMap={fieldConfigMap}
        values={values}
        errors={errors}
        onAction={handleAction}
        data-testid="input"
      />

      {_isEmpty(errors) ? (
        <CssTransition appear>
          <Box $as="span" className="spr-text-02 text-10 text-right mt-1">
            {__contactsT("Press 'Enter' or 'Return' to search")}
          </Box>
        </CssTransition>
      ) : null}
    </Box>
  );
};

export default memo(Input);
