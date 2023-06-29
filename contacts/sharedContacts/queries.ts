//libs
import { gql } from '@apollo/client';

//fragments
import { AUDIENCE_PROFILE_FRAGMENT } from '@/modules/contacts/fragments';

export const SHARED_CONTACTS_PROFILES_QUERY = gql`
  query DstSharedContactsProfiles($audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput!) {
    dstSharedContactsProfiles: dstSharedContacts(searchRequest: $audienceProfileRequestDTOInput) {
      hasMore
      profiles {
        ...AudienceProfile
      }
      start
      totalFound
    }
  }
  ${AUDIENCE_PROFILE_FRAGMENT}
`;

export const SHARED_CONTACTS_FACETS_QUERY = gql`
  query DstSharedContactsFacets($audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput!) {
    dstSharedContactsFacets: dstSharedContacts(searchRequest: $audienceProfileRequestDTOInput) {
      facets {
        facetField {
          key: id
          label: displayName
          field: fieldType
        }
        options: values {
          value: name
          key: name
          label: displayName
          selected
        }
      }
    }
  }
`;
