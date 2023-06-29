//libs
import { useCallback } from 'react';
import { ApolloError, NetworkStatus, useReactiveVar } from '@apollo/client';
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';
import update from 'immutability-helper';

//hooks
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

//constants
import { SHARED_CONTACTS_PROFILES_QUERY } from '@/modules/contacts/sharedContacts/queries';

//variables
import { selectedFacetsVar, searchQueryVar, sortDetailsVar } from '@/modules/contacts/sharedContacts/reactiveVariables';

//utils
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

//types
import { AudienceProfileRequestDTOInput, Profile } from '@/modules/contacts/types';

type DstSharedContactsProfilesQuery = {
  dstSharedContactsProfiles: {
    hasMore: boolean;
    start: number;
    profiles: Array<Profile>;
    totalFound: number;
  };
};

type UseSharedContactsProfiles = () => {
  loading: boolean;
  isPaginating: boolean;
  data: Spr.Undefined<DstSharedContactsProfilesQuery['dstSharedContactsProfiles']>;
  error: Spr.Undefined<ApolloError>;
  fetchMore: () => void;
  refetch: () => void;
};

const useSharedContactsProfiles: UseSharedContactsProfiles = () => {
  const selectedFacets = useReactiveVar(selectedFacetsVar);
  const searchQuery = useReactiveVar(searchQueryVar);
  const sortDetails = useReactiveVar(sortDetailsVar);

  const {
    data: facetsMetadata,
    loading: facetsMetadataLoading,
    error: facetsMetadataError,
    refetch: refetchFacetsMetadata,
  } = useFacetsMetadata();

  const {
    data,
    loading,
    error,
    fetchMore: _fetchMore,
    networkStatus,
    refetch,
  } = useQuery<DstSharedContactsProfilesQuery, { audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput }>(
    SHARED_CONTACTS_PROFILES_QUERY,
    {
      skip: !facetsMetadata,
      variables: {
        audienceProfileRequestDTOInput: getAudienceProfileRequestDTOInput({
          sortKey: sortDetails.sortKey,
          sortOrder: sortDetails.sortOrder,
          start: 0,
          searchQuery,
          selectedFacets,
          facetsMetadata: facetsMetadata!,
        }),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    }
  );

  const fetchMore = useCallback(() => {
    const nextStart = data?.dstSharedContactsProfiles?.profiles?.length || 0;

    _fetchMore({
      variables: {
        audienceProfileRequestDTOInput: getAudienceProfileRequestDTOInput({
          sortKey: sortDetails.sortKey,
          sortOrder: sortDetails.sortOrder,
          start: nextStart,
          searchQuery,
          selectedFacets,
          facetsMetadata: facetsMetadata!,
        }),
      },

      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        return update(previousResult, {
          dstSharedContactsProfiles: {
            profiles: { $push: fetchMoreResult.dstSharedContactsProfiles.profiles },
            hasMore: { $set: fetchMoreResult.dstSharedContactsProfiles.hasMore },
          },
        });
      },
    });
  }, [
    _fetchMore,
    data?.dstSharedContactsProfiles?.profiles?.length,
    facetsMetadata,
    searchQuery,
    selectedFacets,
    sortDetails.sortKey,
    sortDetails.sortOrder,
  ]);

  return {
    loading: facetsMetadataLoading || loading,
    error: facetsMetadataError || error,
    data: data?.dstSharedContactsProfiles,
    fetchMore,
    isPaginating: networkStatus === NetworkStatus.fetchMore,
    refetch: facetsMetadataError ? refetchFacetsMetadata : refetch,
  };
};

export { useSharedContactsProfiles };
