import { gql } from '@apollo/client';

export const EDIT_PROFILE_LIST = gql`
  mutation dstUpdateClientProfileList($clientProfileListId: Long!, $dstProfileListDTO: DstProfileListDTOInput!) {
    dstUpdateClientProfileList(clientProfileListId: $clientProfileListId, dstProfileListDTO: $dstProfileListDTO) {
      id
      clientId
    }
  }
`;
