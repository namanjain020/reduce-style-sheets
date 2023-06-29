//components
import {
  FieldConfigMapBuilder,
  FieldConfigBuilder,
  FieldConfigMap,
  LayoutBuilder,
  Layout,
} from '@sprinklr/spaceweb-form';
import { ChannelInput } from '@/components/channelInput';

//constants
import snTypes, { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { FIELD_TYPES } from '@sprinklr/modules/infra/field/constants';

const CHANNEL_TYPES_WITH_PHONE_INPUT = [snTypes.SMS.type, snTypes.WHATSAPP_BUSINESS.type];

export const getFieldsConfig = ({ channels }: { channels: SnType[] }): FieldConfigMap => {
  const fieldConfigMapBuilder = new FieldConfigMapBuilder();

  channels.forEach((channel: SnType) =>
    fieldConfigMapBuilder.addFieldConfig(
      new FieldConfigBuilder({
        id: channel,
        Component: ChannelInput,
        componentProps: {
          channel,
          fieldType: CHANNEL_TYPES_WITH_PHONE_INPUT.includes(channel) ? FIELD_TYPES.NUMBER : FIELD_TYPES.TEXT,
        },
      }).build()
    )
  );

  return fieldConfigMapBuilder.build();
};

export const getLayout = (channels: SnType[]): Layout => {
  const layoutBuilder = new LayoutBuilder({
    direction: 'vertical',
  });

  channels.forEach((channel: SnType) => layoutBuilder.addNode(channel));

  return layoutBuilder.build();
};
