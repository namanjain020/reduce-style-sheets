// libraries
import _map from 'lodash/map';

// components
import { SelectInput } from '@sprinklr/modules/platform/form/fieldRenderers/SelectInput';

// utils
import { FieldConfigMapBuilder, FieldConfigBuilder, FieldConfigMap } from '@sprinklr/spaceweb-form';

// constants
import { FIELD_IDS } from '../constants';

// types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';
import { TabsMap } from '@/modules/contacts/types';

export const getFieldConfigMap = (__contactsT: ContactsTranslationFn, tabsMap: TabsMap): FieldConfigMap =>
  new FieldConfigMapBuilder()
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FIELD_IDS.CONTACT_TYPES,
        Component: SelectInput,
        componentProps: {
          placeholder: __contactsT('Select Contact Type'),
          label: __contactsT('Contacts From'),
          required: true,
          multi: true,
          picklistValues: _map(tabsMap, ({ label }, id) => ({
            value: id,
            label,
          })),
        },
      }).build()
    )
    .build();
