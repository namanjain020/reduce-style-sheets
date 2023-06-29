//components
import { Box } from '@sprinklr/spaceweb/box';
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  return (
    <>
      <Box className="flex flex-col gap-1">
        <Box>{__contactsT('First Name')}</Box>
        <Tombstone tombstoneClass="w-full h-8 rounded-8" />
      </Box>

      <Box className="flex flex-col gap-1">
        <Box>{__contactsT('Last Name')}</Box>
        <Tombstone tombstoneClass="w-full h-8 rounded-8" />
      </Box>
    </>
  );
};

export { Placeholder };
