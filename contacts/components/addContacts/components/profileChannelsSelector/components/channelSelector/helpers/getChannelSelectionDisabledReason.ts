//types
import { ContactsTranslationFn } from '@/modules/contacts/i18n';

//constants
import SN_TYPES, { SnType } from '@sprinklr/modules/infra/constants/snTypes';

export const getChannelSelectionDisabledReason = ({
  __contactsT,
  selectedChannels,
}: {
  __contactsT: ContactsTranslationFn;
  selectedChannels: Array<SnType>;
}): string => {
  const totalSelectedChannels = selectedChannels.length;
  const selectedChannelsNames = selectedChannels.map(channel => SN_TYPES[channel].name);

  if (totalSelectedChannels === 1) {
    return __contactsT('This channel cannot be merged with {{selectedChannel}}', {
      selectedChannel: selectedChannelsNames[0],
    });
  }

  return __contactsT('This channel cannot be merged with {{commaSeparatedValues}} and {{lastValue}}', {
    commaSeparatedValues: selectedChannelsNames.slice(0, totalSelectedChannels - 1).join(', '),
    lastValue: selectedChannelsNames[totalSelectedChannels - 1],
  });
};
