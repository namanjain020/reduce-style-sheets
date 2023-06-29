// builders
import { LayoutBuilder } from '@sprinklr/spaceweb-form';

export const FIELD_IDS = {
  CONTACT_TYPES: 'contactTypes',
};

export const LAYOUT = new LayoutBuilder({
  direction: 'vertical',
  gap: 2,
})
  .addNode(FIELD_IDS.CONTACT_TYPES)
  .build();
