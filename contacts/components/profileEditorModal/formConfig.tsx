//libs
import { ReactNode } from 'react';

//components
import { TextInput } from '@sprinklr/modules/platform/form/fieldRenderers/TextInput';
import { ChannelInput } from '@/components/channelInput';
import { Stack, StackProps, StackItem } from '@sprinklr/spaceweb/stack';

//utils
import {
  LayoutBuilder,
  FieldConfigMapBuilder,
  FieldConfigBuilder,
  FieldConfigMap,
  Layout,
} from '@sprinklr/spaceweb-form';
import vs from 'spr-validation-schema/lib/validationSchema';
import {
  getSocialProfileHandle,
  getSocialProfileEntityId as getFieldKeyFromSocialProfile,
} from '@sprinklr/modules/universalEntities/profile/helpers/general';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/SocialProfileEntity';

//constants
import snTypes, { SnType, SN_TYPES_ASSOCIATED_WITH_PHONE_NUMBER } from '@sprinklr/modules/infra/constants/snTypes';
import { FIELD_TYPES } from '@sprinklr/modules/infra/field/constants';

//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';
import { AudienceProfile, SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { ErrorTranslationFn } from '@sprinklr/modules/error/i18n';

const FIELD_KEYS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

export const getInitialValues = (profile: AudienceProfile): Spr.StringStringMap => {
  const initialValues = {
    [FIELD_KEYS.FIRST_NAME]: AudienceProfileEntity.getFirstName(profile),
    [FIELD_KEYS.LAST_NAME]: AudienceProfileEntity.getLastName(profile),
  };

  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  socialProfiles.forEach((socialProfile: SocialProfile) => {
    const fieldKey = getFieldKeyFromSocialProfile(socialProfile)!;

    initialValues[fieldKey] = SN_TYPES_ASSOCIATED_WITH_PHONE_NUMBER.has(SocialProfileEntity.getSnType(socialProfile))
      ? SocialProfileEntity.getSnId(socialProfile)
      : getSocialProfileHandle(socialProfile);
  });

  return initialValues;
};

export const getFieldConfigMap = ({
  profile,
  __contactsT,
  channelsAllowedToUpdate,
}: {
  __contactsT: ContactsTranslationFn;
  profile: AudienceProfile;
  channelsAllowedToUpdate: Spr.Undefined<Array<string>>;
}): FieldConfigMap => {
  const fieldConfigMapBuilder = new FieldConfigMapBuilder()
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
    );

  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  socialProfiles.forEach((socialProfile: SocialProfile) => {
    const channel = SocialProfileEntity.getSnType(socialProfile);

    const fieldKey = getFieldKeyFromSocialProfile(socialProfile)!;

    fieldConfigMapBuilder.addFieldConfig(
      new FieldConfigBuilder({
        id: fieldKey,
        Component: ChannelInput,
        componentProps: {
          required: true,
          disabled: !channelsAllowedToUpdate?.includes(channel),
          channel,
          fieldType: FIELD_TYPES.TEXT,
        },
      }).build()
    );
  });

  return fieldConfigMapBuilder.build();
};

const getChannelsLayout = ({
  profile,
  __contactsT,
}: {
  __contactsT: ContactsTranslationFn;
  profile: AudienceProfile;
}): Layout => {
  const layoutBuilder = new LayoutBuilder({
    direction: 'vertical',
    overrides: {
      Stack: ({ children, ...restProps }: { children: ReactNode | ReactNode[] } & StackProps): JSX.Element => (
        <Stack {...restProps} gap={2}>
          <StackItem className="spr-text-02">{__contactsT('Contact Details')}</StackItem>
          {children}
        </Stack>
      ),
    },
  });

  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  socialProfiles.forEach((socialProfile: SocialProfile) => {
    const fieldKey = getFieldKeyFromSocialProfile(socialProfile);

    if (fieldKey) {
      layoutBuilder.addNode(fieldKey);
    }
  });

  return layoutBuilder.build();
};

export const getLayout = ({
  profile,
  __contactsT,
}: {
  __contactsT: ContactsTranslationFn;
  profile: AudienceProfile;
}): Layout =>
  new LayoutBuilder({
    direction: 'vertical',
  })
    .addNode(FIELD_KEYS.FIRST_NAME)
    .addNode(FIELD_KEYS.LAST_NAME)
    .addNode(getChannelsLayout({ profile, __contactsT }))
    .build();

const getFormKeyVsValidatorConfigMap = (__errorT: ErrorTranslationFn): Record<SnType, Function> =>
  ({
    [snTypes.EMAIL.type]: vs.string().email(__errorT('Please enter a valid e-mail')).required(),

    [snTypes.SMS.type]: vs.string().phoneNo(__errorT('Please enter a valid number')).required(),

    [snTypes.WHATSAPP_BUSINESS.type]: vs.string().phoneNo(__errorT('Please enter a valid number')).required(),
  } as Record<SnType, Function>);

export const getValidationSchema = ({
  profile,
  __errorT,
}: {
  __errorT: ErrorTranslationFn;
  profile: AudienceProfile;
}): Spr.StringAnyMap => {
  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  const channelVsValidatorMap = getFormKeyVsValidatorConfigMap(__errorT);

  const validationConfig = socialProfiles.reduce(
    (acc, socialProfile: SocialProfile) => {
      const channel = SocialProfileEntity.getSnType(socialProfile);
      const fieldKey = getFieldKeyFromSocialProfile(socialProfile);

      if (fieldKey && !!channelVsValidatorMap[channel]) {
        acc[fieldKey] = channelVsValidatorMap[channel];
      }

      return acc;
    },
    {
      [FIELD_KEYS.FIRST_NAME]: vs.string().required(),
      [FIELD_KEYS.LAST_NAME]: vs.string().required(),
    }
  );

  return vs.object(validationConfig);
};
