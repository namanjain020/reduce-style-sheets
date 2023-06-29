// libraries
import { gql, useMutation, FetchResult, useReactiveVar } from '@apollo/client';
import { useCallback, useMemo } from 'react';

// hooks
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

// constants
import { CONTACTS_TYPES } from '@/modules/contacts/constants';

// utils
import { insertIf } from '@sprinklr/modules/infra/utils/object';
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

// types
import { ContactsType } from '@/modules/contacts/types';

// variables
import {
  selectedFacetsVar as myContactsSelectedFacetsVar,
  searchQueryVar as myContactsSearchQueryVar,
  sortDetailsVar as myContactsSortDetailsVar,
} from '@/modules/contacts/myContacts/reactiveVariables';
import {
  selectedFacetsVar as sharedContactsSelectedFacetsVar,
  searchQueryVar as sharedContactsSearchQueryVar,
  sortDetailsVar as sharedContactsSortDetailsVar,
} from '@/modules/contacts/sharedContacts/reactiveVariables';

type Return = [
  (selectedContactTypes: Array<ContactsType>) => Promise<FetchResult<{ id: string }>>,
  { loading: boolean }
];

export const EXPORT_CONTACTS_MUTATION = gql`
  mutation dstExportContacts(
    $myContactsAudienceProfileRequestDTO: AudienceProfileRequestDTOInput
    $sharedContactsAudienceProfileRequestDTO: AudienceProfileRequestDTOInput
  ) {
    dstExportContacts(
      myContactsAudienceProfileRequestDTO: $myContactsAudienceProfileRequestDTO
      sharedContactsAudienceProfileRequestDTO: $sharedContactsAudienceProfileRequestDTO
    )
  }
`;

export const useExportContacts = (_onSuccess?: () => void): Return => {
  const { onSuccess, onError } = useSnackbarNotifications();

  const { __contactsT } = useContactsTranslation();

  const { data: facetsMetadata } = useFacetsMetadata();

  const myContactsSelectedFacets = useReactiveVar(myContactsSelectedFacetsVar);
  const myContactsSearchQuery = useReactiveVar(myContactsSearchQueryVar);
  const myContactsSortDetails = useReactiveVar(myContactsSortDetailsVar);

  const sharedContactsSelectedFacets = useReactiveVar(sharedContactsSelectedFacetsVar);
  const sharedContactsSearchQuery = useReactiveVar(sharedContactsSearchQueryVar);
  const sharedContactsSortDetails = useReactiveVar(sharedContactsSortDetailsVar);

  const [exportContactsMutation, { loading }] = useMutation(EXPORT_CONTACTS_MUTATION, {
    onCompleted() {
      onSuccess({
        message: __contactsT(
          'Your export request has been received. We will notify you after it is processed and the report is generated.'
        ),
      });

      _onSuccess?.();
    },
    onError() {
      onError({
        message: __contactsT(
          'Your export request has failed. Kindly, please check the filters and contacts access and try again.'
        ),
      });
    },
  });

  const myContactsAudienceProfileRequestDTO = useMemo(
    () =>
      facetsMetadata
        ? getAudienceProfileRequestDTOInput({
            ...myContactsSortDetails,
            start: 0,
            searchQuery: myContactsSearchQuery,
            selectedFacets: myContactsSelectedFacets,
            facetsMetadata,
          })
        : null,
    [facetsMetadata, myContactsSearchQuery, myContactsSelectedFacets, myContactsSortDetails]
  );

  const sharedContactsAudienceProfileRequestDTO = useMemo(
    () =>
      facetsMetadata
        ? getAudienceProfileRequestDTOInput({
            ...sharedContactsSortDetails,
            start: 0,
            searchQuery: sharedContactsSearchQuery,
            selectedFacets: sharedContactsSelectedFacets,
            facetsMetadata,
          })
        : null,
    [facetsMetadata, sharedContactsSearchQuery, sharedContactsSelectedFacets, sharedContactsSortDetails]
  );

  const exportContacts = useCallback(
    (contactTypes: Array<ContactsType>) =>
      exportContactsMutation({
        variables: {
          ...insertIf(contactTypes.includes(CONTACTS_TYPES.MY_CONTACTS), {
            myContactsAudienceProfileRequestDTO,
          }),
          ...insertIf(contactTypes.includes(CONTACTS_TYPES.SHARED_CONTACTS), {
            sharedContactsAudienceProfileRequestDTO,
          }),
        },
      }),
    [exportContactsMutation, myContactsAudienceProfileRequestDTO, sharedContactsAudienceProfileRequestDTO]
  );

  return [exportContacts, { loading }];
};
