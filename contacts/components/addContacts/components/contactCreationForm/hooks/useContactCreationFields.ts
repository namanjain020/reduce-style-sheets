//libs
import { ApolloError, gql } from '@apollo/client';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//types
import { FieldConfig } from '@/modules/contacts/components/addContacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

const CONTACT_CREATION_FIELDS_QUERY = gql`
  query dstGetContactChannelMetadata($channelTypes: [String]!) {
    contactCreationFields: dstGetContactChannelMetadata(channelTypes: $channelTypes) {
      dataType
      displayName
      fieldName
      fieldType
      identifier
      required
      type
    }
  }
`;

type GetContactCreationFieldsQueryResponse = {
  contactCreationFields: Spr.Undefined<Array<FieldConfig>>;
};

type Return = {
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  data: GetContactCreationFieldsQueryResponse['contactCreationFields'];
  refetch: () => void;
};

export const useContactCreationFields = (channelTypes: Array<SnType>): Return => {
  const { data, error, refetch, loading } = useQuery<GetContactCreationFieldsQueryResponse>(
    CONTACT_CREATION_FIELDS_QUERY,
    {
      variables: {
        channelTypes,
      },
    }
  );

  return {
    loading,
    error,
    refetch,
    data: data?.contactCreationFields,
  };
};
