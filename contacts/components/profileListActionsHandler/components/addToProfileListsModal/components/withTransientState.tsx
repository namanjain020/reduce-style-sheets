//libs
import { useCallback, ComponentType } from 'react';
import { ApolloError } from '@apollo/client';
import _isEmpty from 'lodash/isEmpty';

//components
import EmptyScreen from '@/components/emptyScreen/EmptyScreen';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { Placeholder } from './Placeholder';

//icons
import ErrorIcon from '@sprinklr/spaceweb-icons/solid/Error';
import NoListsIcon from '@sprinklr/spaceweb-icons/placeholder/NoLists';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { ProfileList } from '@space/modules/profileList/types';

const ICON_SIZE = 40;
const EMPTY_SCREEN_OVERRIDES = {
  primaryText: {
    style: 'text-12 spr-text-02 mt-0',
  },
  secondaryText: {
    style: 'text-10 mt-0',
  },
};

type Props<T> = Partial<T> & {
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
  profileLists: Spr.Undefined<Array<ProfileList>>;
};

const ErrorMessage = ({ refetch }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  return (
    <Box className="h-full flex flex-col items-center justify-center gap-1">
      <EmptyScreen
        primaryMessage={__contactsT('Oops! Faced an error.')}
        secondaryMessage={__contactsT('Please click below button to load again.')}
        className="spr-ui-01"
        intent="error"
        overrides={EMPTY_SCREEN_OVERRIDES}
      >
        <ErrorIcon size={ICON_SIZE} className="spr-icon-03" />
      </EmptyScreen>

      <Button onClick={handleRefetch} aria-label={__contactsT('Try Again')} size="xs" variant="secondary">
        {__contactsT('Try Again')}
      </Button>
    </Box>
  );
};

const EmptyProfileLists = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  return (
    <Box className="h-full flex flex-col items-center justify-center gap-4">
      <EmptyScreen
        primaryMessage={__contactsT('No Contact Lists found!')}
        className="spr-ui-01"
        overrides={EMPTY_SCREEN_OVERRIDES}
      >
        <NoListsIcon size={ICON_SIZE} className="spr-icon-03" />
      </EmptyScreen>
    </Box>
  );
};

const withTransientState =
  <T extends object>(WrappedComponent): ComponentType<React.PropsWithChildren<Props<T>>> =>
  ({ loading, error, refetch, profileLists, ...restProps }: Props<T>): JSX.Element => {
    if (loading) {
      return <Placeholder count={5} />;
    }

    if (error) {
      return <ErrorMessage refetch={refetch} />;
    }

    if (_isEmpty(profileLists)) return <EmptyProfileLists />;

    return <WrappedComponent loading={loading} profileLists={profileLists} {...restProps} />;
  };

export { withTransientState };
