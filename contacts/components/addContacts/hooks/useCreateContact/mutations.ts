//libs
import { gql } from '@apollo/client';

export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateProfile($addToContacts: Boolean, $profileCreationRequest: ProfileCreationRequestV2Input!) {
    dstCreateContact: dstCreateProfileV2(
      addToContacts: $addToContacts
      profileCreationRequest: $profileCreationRequest
    ) {
      id
    }
  }
`;
