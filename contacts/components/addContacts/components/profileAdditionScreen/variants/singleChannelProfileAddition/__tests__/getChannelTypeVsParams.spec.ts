//constants
import { getChannelTypeVsParams } from '../constants';

//utils
import { __mockT } from '@sprinklr/modules/infra/tests/mockI18n';

//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';

describe('getChannelTypeVsParams', () => {
  test('should return params corresponding to channel types', () => {
    expect(getChannelTypeVsParams(__mockT as unknown as ContactsTranslationFn, () => [])).toEqual({
      EMAIL: {
        profileAdditionModeSelectorParams: {
          bulkModeRadioLabel: 'Add Email Address in Bulk',
          singleModeRadioLabel: 'Add Single Email Address',
        },
        profileCreationAllowed: true,
        title: 'Enter Email ID',
      },
      LINKEDIN: {
        profileCreationAllowed: true,
        title: 'Enter Profile Identifier',
        warningMessage: undefined,
      },
      SMS: {
        profileAdditionModeSelectorParams: {
          bulkModeRadioLabel: 'Add Phone Number in Bulk',
          singleModeRadioLabel: 'Add Single Phone Number',
        },
        profileCreationAllowed: true,
        title: 'Enter Phone Number',
      },
      TWITTER: {
        profileCreationAllowed: false,
        title: 'Enter Profile Handle',
        warningMessage: 'Profile does not exist on the channel, please input a valid handle.',
      },
      WHATSAPP_BUSINESS: {
        profileAdditionModeSelectorParams: {
          bulkModeRadioLabel: 'Add Phone Number in Bulk',
          singleModeRadioLabel: 'Add Single Phone Number',
        },
        profileCreationAllowed: true,
        title: 'Enter Phone Number',
      },
    });
  });

  test(// eslint-disable-next-line max-len
  'should return `profileCreationAllowed` as false and warningMessage as `Please add a valid LinkedIn connection or a contact with engagement history to your account.` for linkedIn when DP contains LINKEDIN', () => {
    expect(getChannelTypeVsParams(__mockT as unknown as ContactsTranslationFn, () => ['LINKEDIN'])).toEqual(
      expect.objectContaining({
        LINKEDIN: {
          profileCreationAllowed: false,
          title: 'Enter Profile Identifier',
          warningMessage:
            'Please add a valid LinkedIn connection or a contact with engagement history to your account.',
        },
      })
    );
  });
});
