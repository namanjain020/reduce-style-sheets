//libs
import { useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import _isEmpty from 'lodash/isEmpty';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//utils
import { getSearchRequest } from './helpers/getSearchRequest';
import { getAdaptedChannelInputValues } from '@/modules/contacts/utils/getAdaptedChannelInputValues';

//constants
import { SEARCH_PROFILES_QUERY } from '@/modules/contacts/queries';

//types
import { Profile } from '@/modules/contacts/types';
import { ChannelInputValues } from '@/modules/contacts/components/addContacts/types';

type SearchProfilesQueryResponse = {
  dstSearchProfiles: {
    contactStatus: Spr.StringBooleanMap;
    profiles: Array<Profile>;
  };
};

type Props = {
  channelInputValues: ChannelInputValues;
};

export type Return = {
  data: Spr.Undefined<SearchProfilesQueryResponse['dstSearchProfiles']>;
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
};

export const useSearchProfiles = ({ channelInputValues }: Props): Return => {
  const adaptedChannelInputValues = useMemo(
    () => getAdaptedChannelInputValues(channelInputValues),
    [channelInputValues]
  );

  const searchRequest = useMemo(() => getSearchRequest(adaptedChannelInputValues), [adaptedChannelInputValues]);

  const { data, loading, error, refetch } = useQuery<SearchProfilesQueryResponse>(SEARCH_PROFILES_QUERY, {
    variables: { searchRequest },
    skip: _isEmpty(channelInputValues),
  });

  return {
    loading,
    error,
    refetch,
    data: data?.dstSearchProfiles,
  };
};
