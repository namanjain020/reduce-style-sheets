//libs
import { memo } from 'react';
import _noop from 'lodash/noop';

//components
import EmptyScreen from '@/components/emptyScreen';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import ErrorIcon from '@sprinklr/spaceweb-icons/placeholder/Error';
import { ModalBody, ModalFooter, ModalHeader } from '@sprinklr/spaceweb/modal';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

const ICON_SIZE = 50;

type Props = { refetch: () => void };

const ErrorScreen = ({ refetch }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  return (
    <>
      <ModalHeader className="text-20">{__contactsT('Select Channel')}</ModalHeader>

      <ModalBody>
        <Box className="h-full flex flex-col gap-4 items-center justify-center">
          <EmptyScreen
            id="channels-data"
            primaryMessage={__contactsT('Oops! Faced an error.')}
            secondaryMessage={__contactsT('Please click button below to try again.')}
            className="spr-ui-01"
            intent="error"
          >
            <ErrorIcon size={ICON_SIZE} className="spr-icon-03" />
          </EmptyScreen>

          <Button onClick={() => refetch()} aria-label={__contactsT('Try Again')}>
            {__contactsT('Try Again')}
          </Button>
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button size="md" onClick={_noop} disabled>
          {__commonT('Next')}
        </Button>
      </ModalFooter>
    </>
  );
};

const MemoizedErrorScreen = memo(ErrorScreen);

export { MemoizedErrorScreen as ErrorScreen };
