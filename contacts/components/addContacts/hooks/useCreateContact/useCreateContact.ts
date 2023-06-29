//libs
import { useMutation, MutationFunction } from '@apollo/client';
import { useCallback } from 'react';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';

//constants
import { MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY } from '@/modules/contacts/myContacts/queries';
import { CREATE_CONTACT_MUTATION } from './mutations';

//types
import { ProfileCreationRequest } from './types';

const useCreateContact = ({
  onSuccessCallback,
}: {
  onSuccessCallback?: () => void;
}): {
  loading: boolean;
  createContact: MutationFunction<
    Spr.StringAnyMap,
    {
      addToContacts: boolean;
      profileCreationRequest: ProfileCreationRequest;
    }
  >;
} => {
  const { __contactsT } = useContactsTranslation();
  const { onError, onSuccess } = useSnackbarNotifications();

  const failureCallback = useCallback(
    () => onError({ message: __contactsT('I am unable to create your contact!') }),
    [__contactsT, onError]
  );

  const successCallback = useCallback(() => {
    onSuccess({ message: __contactsT('I have created your contact successfully!') });

    onSuccessCallback?.();
  }, [onSuccess, __contactsT, onSuccessCallback]);

  const [createContact, { loading }] = useMutation<
    Spr.StringAnyMap,
    {
      addToContacts: boolean;
      profileCreationRequest: ProfileCreationRequest;
    }
  >(CREATE_CONTACT_MUTATION, {
    onCompleted: successCallback,
    onError: failureCallback,
    refetchQueries: [MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY],
  });

  return { createContact, loading };
};

export { useCreateContact };
