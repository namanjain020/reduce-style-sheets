/**
 * Created by: Raj Meghpara
 * Date: 2021-08-07
 * Time: 13:08
 */

//components
import {
  FieldConfigMapBuilder,
  FieldConfigBuilder,
  FieldConfigMap,
  Layout,
  LayoutBuilder,
} from '@sprinklr/spaceweb-form';

//utils
import { getComponent } from 'spr-dynamic-form/lib/formField/factory';

//types
import { FieldConfig } from '../../types';

//TODO: Remove these hard coded values once backend changes are merged for disabled field.
const DISABLED_FIELDS = ['url', 'email', 'pNo'];

export const getFieldConfigMap = (fields: FieldConfig[]): FieldConfigMap => {
  const fieldConfigMap = fields.reduce(
    (_fieldConfigMap, field: FieldConfig) =>
      _fieldConfigMap.addFieldConfig(
        new FieldConfigBuilder({
          id: field.fieldName,
          //@ts-ignore
          Component: getComponent({ field }),
          componentProps: {
            placeholder: field.displayName,
            required: field.required,
            disabled: DISABLED_FIELDS.includes(field.fieldName),
            size: 'md',
            formLabel: field.displayName,
          },
        }).build()
      ),
    new FieldConfigMapBuilder()
  );

  return fieldConfigMap.build();
};

export const getLayout = (fields: FieldConfig[]): Layout => {
  const layout = fields.reduce(
    (_layout, field) => _layout.addNode(field.fieldName),
    new LayoutBuilder({
      direction: 'vertical',
    })
  );

  return layout.build();
};
