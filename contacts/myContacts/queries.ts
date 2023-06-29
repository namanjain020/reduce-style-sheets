//libs
import { gql } from '@apollo/client';

//fragments
import { AUDIENCE_PROFILE_FRAGMENT } from '@/modules/contacts/fragments';

export const MY_CONTACTS_PROFILES_QUERY = gql`
  query DstMyContacts($audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput!) {
    dstMyContacts(searchRequest: $audienceProfileRequestDTOInput) {
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

export const MY_CONTACTS_FACETS_QUERY = gql`
  query DstMyContactsFacets($audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput!) {
    dstMyContactsFacets: dstMyContacts(searchRequest: $audienceProfileRequestDTOInput) {
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
