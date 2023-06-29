//libs
import { useCallback } from 'react';
import update from 'immutability-helper';
import { gql, ApolloError, NetworkStatus } from '@apollo/client';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//types
import { ProfileList } from '@space/modules/profileList/types';

const PAGE_SIZE = 20;

const FETCH_PROFILE_LISTS_QUERY = gql`
  query FetchProfileLists($profileListSearchRequest: ProfileListSearchRequestInput!) {
    fetchProfileLists(profileListSearchRequest: $profileListSearchRequest) {
      hasMore
      searchResults {
        id
        name
        description
        clientId
      }
      totalHits
    }
  }
`;

type FetchProfileListsQueryResponse = {
  fetchProfileLists: {
    hasMore: boolean;
    totalHits: number;
    searchResults: Array<ProfileList>;
  };
};

type FetchProfileListsVariables = {
  profileListSearchRequest: {
    client: boolean;
    page: {
      page: number;
      size: number;
    };
    query: string;
  };
};

type UseSharedContactsProfiles = (params: { searchQuery: string }) => {
  loading: boolean;
  isPaginating: boolean;
  data: Spr.Undefined<FetchProfileListsQueryResponse['fetchProfileLists']>;
  error: Spr.Undefined<ApolloError>;
  fetchMore: () => void;
  refetch: () => void;
};

const useFetchProfileLists: UseSharedContactsProfiles = ({ searchQuery }) => {
  const {
    data,
    loading,
    error,
    fetchMore: _fetchMore,
    networkStatus,
    refetch,
  } = useQuery<FetchProfileListsQueryResponse, FetchProfileListsVariables>(FETCH_PROFILE_LISTS_QUERY, {
    variables: {
      profileListSearchRequest: {
        client: true,
        page: {
          page: 0,
          size: PAGE_SIZE,
        },
        query: searchQuery,
      },
    },
  });

  const fetchMore = useCallback(() => {
    const numberOfProfiles = data?.fetchProfileLists?.searchResults?.length;

    const nextPage = numberOfProfiles ? Math.floor(numberOfProfiles / PAGE_SIZE) : 0;

    _fetchMore({
      variables: {
        profileListSearchRequest: {
          client: true,
          page: {
            page: nextPage,
            size: PAGE_SIZE,
          },
          query: searchQuery,
        },
      },

      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        return update(previousResult, {
          fetchProfileLists: {
            searchResults: { $push: fetchMoreResult.fetchProfileLists.searchResults },
            hasMore: { $set: fetchMoreResult.fetchProfileLists.hasMore },
          },
        });
      },
    });
  }, [_fetchMore, data?.fetchProfileLists?.searchResults?.length, searchQuery]);

  return {
    loading,
    error,
    data: data?.fetchProfileLists,
    fetchMore,
    isPaginating: networkStatus === NetworkStatus.fetchMore,
    refetch,
  };
};

export { useFetchProfileLists };
