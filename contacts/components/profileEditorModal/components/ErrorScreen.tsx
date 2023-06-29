//libs
import { useCallback } from 'react';

//components
import EmptyScreen from '@/components/emptyScreen/EmptyScreen';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';

//icons
import ErrorIcon from '@sprinklr/spaceweb-icons/solid/Error';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const ICON_SIZE = 50;

const ErrorScreen = ({ refetch }: { refetch: () => void }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  return (
    <Box className="flex flex-col gap-4 justify-center items-center h-full">
      <EmptyScreen
        primaryMessage={__contactsT('Oops! Faced an error.')}
        secondaryMessage={__contactsT('Please click below button to load again.')}
        className="spr-ui-01"
        intent="error"
      >
        <ErrorIcon size={ICON_SIZE} className="spr-icon-03" />
      </EmptyScreen>

      <Button onClick={handleRefetch} aria-label={__contactsT('Try Again')} size="sm" variant="secondary">
        {__contactsT('Try Again')}
      </Button>
    </Box>
  );
};

export { ErrorScreen };
