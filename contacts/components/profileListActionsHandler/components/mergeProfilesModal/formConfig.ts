//components
import { TextInput } from '@sprinklr/modules/platform/form/fieldRenderers/TextInput';

//utils
import { LayoutBuilder, FieldConfigMapBuilder, FieldConfigBuilder, FieldConfigMap } from '@sprinklr/spaceweb-form';
import vs from 'spr-validation-schema/lib/validationSchema';

//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';

const FIELD_KEYS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

export const INITIAL_VALUES = {
  [FIELD_KEYS.FIRST_NAME]: '',
  [FIELD_KEYS.LAST_NAME]: '',
};

export const getFieldConfigMap = (__contactsT: ContactsTranslationFn): FieldConfigMap =>
  new FieldConfigMapBuilder()
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FIELD_KEYS.FIRST_NAME,
        Component: TextInput,
        componentProps: {
          label: __contactsT('First Name'),
          placeholder: __contactsT('First Name'),
          required: true,
        },
      }).build()
    )
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FIELD_KEYS.LAST_NAME,
        Component: TextInput,
        componentProps: {
          label: __contactsT('Last Name'),
          placeholder: __contactsT('Last Name'),
          required: true,
        },
      }).build()
    )
    .build();

export const LAYOUT = new LayoutBuilder({
  direction: 'vertical',
})
  .addNode(FIELD_KEYS.FIRST_NAME)
  .addNode(FIELD_KEYS.LAST_NAME)
  .build();

export const VALIDATION_SCHEMA = vs.object({
  [FIELD_KEYS.FIRST_NAME]: vs.string().required(),
  [FIELD_KEYS.LAST_NAME]: vs.string().required(),
});
