import { gql } from '@apollo/client';

export const CREATE_PROFILE_LIST = gql`
  mutation dstCreateClientProfileList($dstProfileListDTO: DstProfileListDTOInput!) {
    dstCreateClientProfileList(dstProfileListDTO: $dstProfileListDTO) {
      id
      clientId
    }
  }
`;
