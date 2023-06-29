//libs
import { ComponentType } from 'react';
import { ApolloError } from '@apollo/client';
import _isEmpty from 'lodash/isEmpty';

//components
import EmptyScreen from '@/components/emptyScreen/EmptyScreen';
import ErrorIcon from '@sprinklr/spaceweb-icons/placeholder/Error';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { EmptyContacts } from './EmptyContacts';
import { ContactCardWithActionsPlaceholders } from '@/modules/contacts/components/placeholders/ContactCardWithActionsPlaceholders';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { Profile, ContactsType, ProfileSelection } from '@/modules/contacts/types';

const Placeholder = (): JSX.Element => <ContactCardWithActionsPlaceholders count={6} />;

type Props<T> = T & {
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  contacts?: Profile[];
  refetch: () => void;
  selectedTab: ContactsType;
  profileSelection: ProfileSelection;
};

export const withTransientState = <T extends object>(
  WrappedComponent
): ComponentType<React.PropsWithChildren<Props<T>>> => {
  const WithTransientState = (props: Props<T>): JSX.Element => {
    const { loading, error, refetch, selectedTab, contacts, ...restProps } = props;

    const { __contactsT } = useContactsTranslation();

    if (error) {
      return (
        <Box className="flex flex-col gap-5 items-center justify-center w-full spr-ui-01 p-32 rounded-8">
          <EmptyScreen
            id="failureNotifications"
            primaryMessage={__contactsT('Error fetching Contacts!')}
            secondaryMessage={__contactsT('Please click button below to load again.')}
            className="spr-ui-01"
            intent="error"
          >
            <ErrorIcon size={50} />
          </EmptyScreen>
          <Button onClick={() => refetch()} disabled={loading} isLoading={loading}>
            {__contactsT('Load again')}
          </Button>
        </Box>
      );
    }

    if (loading) return <Placeholder />;

    if (_isEmpty(contacts)) return <EmptyContacts selectedTab={selectedTab} />;

    return <WrappedComponent loading={loading} contacts={contacts} selectedTab={selectedTab} {...restProps} />;
  };

  return WithTransientState;
};
