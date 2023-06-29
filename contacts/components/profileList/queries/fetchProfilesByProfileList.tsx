//lib
import { gql } from '@apollo/client';

export const FETCH_PROFILES_BY_PROFILE_LIST = gql`
  query fetchAllProfilesByProfileList($profileListId: Long!) {
    fetchAllProfilesByProfileList(profileListId: $profileListId) {
      id
      socialProfiles {
        name
        username
        profileImageUrl
        largeProfileImageUrl
      }
    }
  }
`;
