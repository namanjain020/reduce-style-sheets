//libs
import _noop from 'lodash/noop';

//components
import Button from '@/components/button';
import { ContactCreationFormLayout, SLOT_NAMES } from './contactCreationFormLayout';
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';
import { Box } from '@sprinklr/spaceweb/box';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  return (
    <ContactCreationFormLayout title={__contactsT('Create Contact')}>
      <ContactCreationFormLayout.Slot name={SLOT_NAMES.BODY}>
        <Box className="flex flex-col gap-3" data-testid="contactCreationFormPlaceholder">
          <Box className="flex flex-col gap-1">
            <Box>{__contactsT('First Name')}</Box>
            <Tombstone tombstoneClass="w-full h-8 rounded-8" />
          </Box>

          <Box className="flex flex-col gap-1">
            <Box>{__contactsT('Last Name')}</Box>
            <Tombstone tombstoneClass="w-full h-8 rounded-8" />
          </Box>
        </Box>
      </ContactCreationFormLayout.Slot>

      <ContactCreationFormLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Button size="md" onClick={_noop} isLoading>
          {__contactsT('Add Contact')}
        </Button>
      </ContactCreationFormLayout.Slot>
    </ContactCreationFormLayout>
  );
};

export { Placeholder };
