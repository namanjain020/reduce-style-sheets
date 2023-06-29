//libs
import { useCallback } from 'react';
import { ApolloError, NetworkStatus, useReactiveVar } from '@apollo/client';
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';
import update from 'immutability-helper';

//hooks
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

//constants
import { MY_CONTACTS_PROFILES_QUERY } from '@/modules/contacts/myContacts/queries';

//variables
import { selectedFacetsVar, searchQueryVar, sortDetailsVar } from '@/modules/contacts/myContacts/reactiveVariables';

//utils
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

//types
import { AudienceProfileRequestDTOInput, Profile } from '@/modules/contacts/types';

type DstMyContactsQuery = {
  dstMyContacts: {
    hasMore: boolean;
    start: number;
    profiles: Array<Profile>;
    totalFound: number;
  };
};

type UseMyContactsProfiles = () => {
  loading: boolean;
  isPaginating: boolean;
  data: Spr.Undefined<DstMyContactsQuery['dstMyContacts']>;
  error: Spr.Undefined<ApolloError>;
  fetchMore: () => void;
  refetch: () => void;
};

const useMyContactsProfiles: UseMyContactsProfiles = () => {
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
  } = useQuery<DstMyContactsQuery, { audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput }>(
    MY_CONTACTS_PROFILES_QUERY,
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
    const nextStart = data?.dstMyContacts?.profiles?.length || 0;

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
          dstMyContacts: {
            profiles: { $push: fetchMoreResult.dstMyContacts.profiles },
            hasMore: { $set: fetchMoreResult.dstMyContacts.hasMore },
          },
        });
      },
    });
  }, [
    _fetchMore,
    data?.dstMyContacts?.profiles?.length,
    facetsMetadata,
    searchQuery,
    selectedFacets,
    sortDetails.sortKey,
    sortDetails.sortOrder,
  ]);

  return {
    loading: facetsMetadataLoading || loading,
    error: facetsMetadataError || error,
    data: data?.dstMyContacts,
    fetchMore,
    isPaginating: networkStatus === NetworkStatus.fetchMore,
    refetch: facetsMetadataError ? refetchFacetsMetadata : refetch,
  };
};

export { useMyContactsProfiles };
