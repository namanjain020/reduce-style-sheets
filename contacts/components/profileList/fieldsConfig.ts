//components
import { TextInput } from '@sprinklr/modules/platform/form/fieldRenderers/TextInput';
import { TextArea } from '@sprinklr/modules/platform/form/fieldRenderers/TextArea';
import { ProfileSelector } from './components/profileSelector';

//builder
import {
  FieldConfigMapBuilder,
  FieldConfigBuilder,
  FieldConfigMap,
  LayoutBuilder,
  Layout,
} from '@sprinklr/spaceweb-form';

//constants
import { FORM_FIELDS } from './constants';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { I18nextTFunction } from '@sprinklr/modules/sprI18Next';

export const getFieldsConfig = (
  profiles: Spr.Undefined<Array<AudienceProfile>>,
  __contactsT: I18nextTFunction,
  __commonT: I18nextTFunction
): FieldConfigMap =>
  new FieldConfigMapBuilder()
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FORM_FIELDS.NAME,
        Component: TextInput,
        componentProps: {
          required: true,
          label: __contactsT('Contact List Name'),
          placeholder: __contactsT('Enter Contact List Name'),
          size: 'md',
        },
      })
    )
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FORM_FIELDS.PROFILES,
        Component: ProfileSelector,
        componentProps: {
          selectedProfiles: profiles ?? (EMPTY_ARRAY_READONLY as unknown as Array<AudienceProfile>),
          size: 'md',
        },
      })
    )
    .addFieldConfig(
      new FieldConfigBuilder({
        id: FORM_FIELDS.DESCRIPTION,
        Component: TextArea,
        componentProps: {
          size: 'md',
          label: __commonT('Description'),
          placeholder: __commonT('Add description'),
          overrides: {
            Textarea: {
              props: {
                overrides: {
                  Input: {
                    style: {
                      resize: 'none',
                    },
                  },
                },
              },
            },
          },
        },
      })
    )
    .build();

export const getLayout = ({ showProfileSelector }: { showProfileSelector: boolean }): Layout => {
  const layout = new LayoutBuilder({
    direction: 'vertical',
  })
    .addNode(FORM_FIELDS.NAME)
    .addNode(FORM_FIELDS.DESCRIPTION);

  if (showProfileSelector) {
    layout.addNode(FORM_FIELDS.PROFILES);
  }

  return layout.build();
};
