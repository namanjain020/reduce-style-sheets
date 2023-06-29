//libs
import _noop from 'lodash/noop';

//components
import Button from '@/components/button';
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';
import { Box } from '@sprinklr/spaceweb/box';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  return (
    <ProfileAdditionLayout title={__contactsT('Add Contact')}>
      <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
        <Box className="flex flex-row gap-2 items-center">
          <Tombstone tombstoneClass="w-8 h-8 rounded-full" />
          <Tombstone tombstoneClass="w-10 h-5 rounded-2" />
        </Box>

        <Box className="flex flex-col gap-2">
          <Box $as="span"> {__contactsT('Add Contact Details')}</Box>
          <Tombstone tombstoneClass="w-full h-8 mb-1 rounded-8" />
        </Box>
      </ProfileAdditionLayout.Slot>

      <ProfileAdditionLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Button size="md" onClick={_noop} isLoading>
          {__commonT('Create Contact')}
        </Button>
      </ProfileAdditionLayout.Slot>
    </ProfileAdditionLayout>
  );
};

export { Placeholder };
