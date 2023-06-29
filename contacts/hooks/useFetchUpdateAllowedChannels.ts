//libs
import { gql, ApolloError } from '@apollo/client';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

type UseFetchUpdateAllowedChannels = () => {
  channelsAllowedToUpdate: Spr.Undefined<Array<string>>;
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
};

const FETCH_UPDATE_ALLOWED_CHANNELS_QUERY = gql`
  query FetchUpdateAllowedChannels {
    fetchUpdateAllowedChannels
  }
`;

export const useFetchUpdateAllowedChannels: UseFetchUpdateAllowedChannels = () => {
  const { data, loading, error, refetch } = useQuery<{ fetchUpdateAllowedChannels: Spr.Undefined<Array<string>> }>(
    FETCH_UPDATE_ALLOWED_CHANNELS_QUERY,
    {
      fetchPolicy: 'cache-first',
    }
  );

  return {
    channelsAllowedToUpdate: data?.fetchUpdateAllowedChannels,
    loading,
    error,
    refetch,
  };
};
