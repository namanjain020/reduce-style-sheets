//libs
import { useCallback } from 'react';
import { ApolloError } from '@apollo/client';

//components
import EmptyScreen from '@/components/emptyScreen/EmptyScreen';
import { Box } from '@sprinklr/spaceweb/box';
import ErrorIcon from '@sprinklr/spaceweb-icons/placeholder/Error';
import Button from '@/components/button';
import Tombstone from '@sprinklr/modules/infra/components/Tombstone';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

const Placeholder = (): JSX.Element => (
  <Box className="flex flex-col gap-4">
    <Tombstone tombstoneClass="w-full h-11 rounded-8" />
    <Tombstone tombstoneClass="w-full h-11 rounded-8" />
  </Box>
);

const ICON_SIZE = 45;

const ErrorScreen = ({ refetch }: { refetch: () => void }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const handleClick = useCallback(() => refetch(), [refetch]);

  return (
    <Box className="flex flex-col gap-4 items-center justify-center">
      <EmptyScreen
        id="contactsPreviewScreenError"
        primaryMessage={__contactsT('Oops! Faced an error.')}
        secondaryMessage={__contactsT('Please click button below to try again.')}
        className="spr-ui-01"
        intent="error"
      >
        <ErrorIcon size={ICON_SIZE} className="spr-icon-03" />
      </EmptyScreen>

      <Button onClick={handleClick} aria-label={__contactsT('Try Again')} size="sm">
        {__contactsT('Try Again')}
      </Button>
    </Box>
  );
};

type Props<T> = T & {
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
};

export const withTransientState = <T extends object>(
  WrappedComponent
): React.ComponentType<React.PropsWithChildren<Props<T>>> => {
  const WithTransientState = ({ loading, error, refetch, ...restProps }: Props<T>) => {
    if (loading) return <Placeholder />;

    if (error) {
      return <ErrorScreen refetch={refetch} />;
    }

    return <WrappedComponent {...restProps} />;
  };

  return WithTransientState;
};
