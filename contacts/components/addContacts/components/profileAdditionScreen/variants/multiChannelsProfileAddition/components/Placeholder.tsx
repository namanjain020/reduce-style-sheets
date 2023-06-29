//libs
import _noop from 'lodash/noop';

//components
import Button from '@/components/button';
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';
import { ProfileAdditionModeSelector } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector';
import { Box } from '@sprinklr/spaceweb/box';

//constants
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  return (
    <ProfileAdditionLayout title={__contactsT('Add Contact')}>
      <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
        <ProfileAdditionModeSelector mode={PROFILE_ADDITION_MODES.SINGLE} onModeChange={_noop} />

        <Box className="flex flex-col gap-2">
          <Box $as="span"> {__contactsT('Add Contact Details')}</Box>
          <Tombstone tombstoneClass="w-full h-8 mb-1 rounded-8" />
          <Tombstone tombstoneClass="w-full h-8 rounded-8" />
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
