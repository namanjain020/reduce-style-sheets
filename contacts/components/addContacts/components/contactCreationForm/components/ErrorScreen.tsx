//libs
import { useCallback } from 'react';
import _noop from 'lodash/noop';

//components
import EmptyScreen from '@/components/emptyScreen';
import ErrorIcon from '@sprinklr/spaceweb-icons/placeholder/Error';
import Button from '@/components/button';
import { ContactCreationFormLayout, SLOT_NAMES } from './contactCreationFormLayout';
import { Box } from '@sprinklr/spaceweb/box';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const ICON_SIZE = 50;

export const ErrorScreen = ({ refetch }: { refetch: () => void }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const handleClick = useCallback(() => refetch(), [refetch]);

  return (
    <ContactCreationFormLayout title={__contactsT('Create Contact')}>
      <ContactCreationFormLayout.Slot name={SLOT_NAMES.BODY}>
        <Box className="flex flex-col gap-4 items-center h-full justify-center">
          <EmptyScreen
            id="contactCreationFormError"
            primaryMessage={__contactsT('Oops! Faced an error.')}
            secondaryMessage={__contactsT('Please click button below to try again.')}
            className="spr-ui-01"
            intent="error"
          >
            <ErrorIcon size={ICON_SIZE} className="spr-icon-03" />
          </EmptyScreen>

          <Button onClick={handleClick} aria-label={__contactsT('Try Again')}>
            {__contactsT('Try Again')}
          </Button>
        </Box>
      </ContactCreationFormLayout.Slot>

      <ContactCreationFormLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Button size="md" onClick={_noop} disabled>
          {__contactsT('Add Contact')}
        </Button>
      </ContactCreationFormLayout.Slot>
    </ContactCreationFormLayout>
  );
};
