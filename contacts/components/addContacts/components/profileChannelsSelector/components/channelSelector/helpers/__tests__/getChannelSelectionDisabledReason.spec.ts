//helpers/utils
import { getChannelSelectionDisabledReason } from '../getChannelSelectionDisabledReason';
import { __mockT } from '@sprinklr/modules/infra/tests/mockI18n';

//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';

describe('getChannelSelectionDisabledReason', () => {
  test('should return `This channel cannot be merged with {{selectedChannel}}` when selectedChannels size is 1', () => {
    expect(
      getChannelSelectionDisabledReason({
        __contactsT: __mockT as unknown as ContactsTranslationFn,
        selectedChannels: ['SMS'],
      })
    ).toEqual('This channel cannot be merged with SMS');
  });

  test('should return `This channel cannot be merged with {{commaSeparatedValues}} and {{lastValue}}` when selectedChannels size is more than 1', () => {
    expect(
      getChannelSelectionDisabledReason({
        __contactsT: __mockT as unknown as ContactsTranslationFn,
        selectedChannels: ['SMS', 'WHATSAPP_BUSINESS', 'EMAIL'],
      })
    ).toEqual('This channel cannot be merged with SMS, WhatsApp Business and Email');
  });
});
