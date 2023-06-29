// libraries
import { gql } from '@apollo/client';

// fragments
import { CONTACT_INFO_FRAGMENT } from '@space/modules/profile/queries/fragments';

export const SOCIAL_PROFILE_FRAGMENT = gql`
  fragment SocialProfile on SocialProfile {
    name
    type
    snModifiedTime
    additional
    bio
    language
    lastInteractionTime
    profileImageUrl
    snCreatedTime
    snId
    largeProfileImageUrl
    verified
    statusCount
    url
    lastInteractionTime
    followers
    following
    username
  }
`;

export const WORKFLOW_PROPERTIES_FRAGMENT = gql`
  fragment ProfileWorkflowProperties on ProfileWorkflowProperties {
    tags {
      tagName
      iconUrl
    }
    userCustomProperties
    clientCustomProperties
    partnerCustomProperties
    clientProfileLists
    partnerProfileLists
  }
`;

export const AUDIENCE_PROFILE_FRAGMENT = gql`
  fragment AudienceProfile on AudienceProfile {
    id
    contactInfo {
      ...ContactInfo
    }
    snCreatedTime
    snModifiedTime
    createdTime
    modifiedTime
    socialProfiles {
      ...SocialProfile
    }
    profileWorkflowProperties {
      ...ProfileWorkflowProperties
    }
    additional
    clientProfileLists {
      id
      name
      clientId
    }
  }
  ${CONTACT_INFO_FRAGMENT}
  ${SOCIAL_PROFILE_FRAGMENT}
  ${WORKFLOW_PROPERTIES_FRAGMENT}
`;
