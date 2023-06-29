//libs
import { gql } from '@apollo/client';

//constants
import { AUDIENCE_PROFILE_FRAGMENT } from '@/modules/contacts/fragments';

export const FACETS_METADATA_QUERY = gql`
  query FacetsMetadata {
    facetsMetadata {
      additional
      id
      displayName
      fieldType
      priority
      rangeFacet
    }
  }
`;

export const GET_CONTACT_CHANNELS_DATA_QUERY = gql`
  query GetContactChannelsData {
    dstGetContactChannels
  }
`;

export const SEARCH_PROFILES_QUERY = gql`
  query SearchProfile($searchRequest: UniversalSearchDTOInput!) {
    dstSearchProfiles: dstSearchProfile(searchRequest: $searchRequest) {
      contactStatus
      profiles {
        ...AudienceProfile
      }
    }
  }
  ${AUDIENCE_PROFILE_FRAGMENT}
`;

export const ADD_CONTACT_MUTATION = gql`
  mutation AddContact($universalProfileIds: [String]!) {
    dstAddContact(universalProfileIds: $universalProfileIds)
  }
`;

export const DST_ALL_CONTACTS = gql`
  query DstAllContacts($searchRequest: DstAudienceProfileRequestDTOInput!) {
    dstAllContacts(searchRequest: $searchRequest) {
      profiles {
        id
        socialProfiles {
          name
          username
          largeProfileImageUrl
          profileImageUrl
        }
      }
      hasMore
    }
  }
`;

export const DELETE_CONTACT_MUTATION = gql`
  mutation dstDeleteContact($universalProfileIds: [String]!) {
    dstDeleteContact: dstRemoveContact(universalProfileIds: $universalProfileIds)
  }
`;

export const FETCH_CLIENT_PROFILE_LISTS_QUERY = gql`
  query FetchClientProfileLists {
    clientProfileLists {
      id
      name
      clientId
    }
  }
`;
