//constants
import { CONTACTS_TYPES } from '@/modules/contacts/constants';

//components
import EmptyScreen from '@/components/emptyScreen';
import NoCoursesIcon from '@sprinklr/spaceweb-icons/placeholder/NoProduct';
import { Box } from '@sprinklr/spaceweb/box';
import { AddContactButton } from '@/modules/contacts/components/AddContactButton';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { ContactsType } from '@/modules/contacts/types';

type Props = { selectedTab: ContactsType };

const EmptyContacts = ({ selectedTab }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const primaryMessage = __contactsT('No contacts found!');
  const secondaryMessage =
    selectedTab === CONTACTS_TYPES.SHARED_CONTACTS
      ? __contactsT('We couldn’t find any contacts. Please check again later.')
      : '';

  return (
    <Box className="flex flex-col gap-3 justify-center items-center">
      <EmptyScreen primaryMessage={primaryMessage} secondaryMessage={secondaryMessage}>
        <NoCoursesIcon size={300} />
      </EmptyScreen>
      {selectedTab === CONTACTS_TYPES.MY_CONTACTS ? <AddContactButton /> : null}
    </Box>
  );
};

export { EmptyContacts };
