//components
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';
import { Box } from '@sprinklr/spaceweb/box';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  return (
    <Box className="flex-1 flex flex-col gap-2">
      <Box className="text-14 inline-block font-400">
        {__contactsT('Upload a file with information about multiple contacts')}
      </Box>

      <Box className="w-full flex-1">
        <Tombstone tombstoneClass="w-full h-full rounded-8" />
      </Box>
    </Box>
  );
};

export { Placeholder };
