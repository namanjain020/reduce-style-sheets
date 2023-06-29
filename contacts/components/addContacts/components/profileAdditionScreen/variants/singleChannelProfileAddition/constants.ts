//constants
import snTypes, { SnType } from '@sprinklr/modules/infra/constants/snTypes';

//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';
import { SprFeature } from '@space/core/contexts/sprEnv';

//TODO: To be removed after backend changes
export const getChannelTypeVsParams = (
  __contactsT: ContactsTranslationFn,
  getValue: SprFeature['getValue']
): Partial<
  Record<
    SnType,
    {
      title: string;
      profileCreationAllowed: boolean;
      warningMessage?: string;
      profileAdditionModeSelectorParams?: {
        singleModeRadioLabel: string;
        bulkModeRadioLabel: string;
      };
    }
  >
> => ({
  [snTypes.WHATSAPP_BUSINESS.type]: {
    title: __contactsT('Enter Phone Number'),
    profileAdditionModeSelectorParams: {
      singleModeRadioLabel: __contactsT('Add Single Phone Number'),
      bulkModeRadioLabel: __contactsT('Add Phone Number in Bulk'),
    },
    profileCreationAllowed: true,
  },

  [snTypes.SMS.type]: {
    title: __contactsT('Enter Phone Number'),
    profileAdditionModeSelectorParams: {
      singleModeRadioLabel: __contactsT('Add Single Phone Number'),
      bulkModeRadioLabel: __contactsT('Add Phone Number in Bulk'),
    },
    profileCreationAllowed: true,
  },

  [snTypes.LINKEDIN.type]: {
    title: __contactsT('Enter Profile Identifier'),
    warningMessage: getValue('DISTRIBUTED_PROFILE_CREATION_DISABLED_CHANNELS', 'D')?.includes(snTypes.LINKEDIN.type)
      ? __contactsT('Please add a valid LinkedIn connection or a contact with engagement history to your account.')
      : undefined,
    profileCreationAllowed: !getValue('DISTRIBUTED_PROFILE_CREATION_DISABLED_CHANNELS', 'D')?.includes(
      snTypes.LINKEDIN.type
    ),
  },

  [snTypes.EMAIL.type]: {
    title: __contactsT('Enter Email ID'),
    profileAdditionModeSelectorParams: {
      singleModeRadioLabel: __contactsT('Add Single Email Address'),
      bulkModeRadioLabel: __contactsT('Add Email Address in Bulk'),
    },
    profileCreationAllowed: true,
  },

  [snTypes.TWITTER.type]: {
    title: __contactsT('Enter Profile Handle'),
    warningMessage: __contactsT('Profile does not exist on the channel, please input a valid handle.'),
    profileCreationAllowed: false,
  },
});
