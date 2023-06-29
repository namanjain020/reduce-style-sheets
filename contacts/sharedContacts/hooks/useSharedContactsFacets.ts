//libs
import { ApolloError, useReactiveVar } from '@apollo/client';
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//hooks
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

//variables
import { selectedFacetsVar, searchQueryVar, sortDetailsVar } from '@/modules/contacts/sharedContacts/reactiveVariables';

//constants
import { SHARED_CONTACTS_FACETS_QUERY } from '@/modules/contacts/sharedContacts/queries';

//utils
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

//types
import { Facet, AudienceProfileRequestDTOInput } from '@/modules/contacts/types';

type DstSharedContactsFacetsQuery = {
  dstSharedContactsFacets: {
    facets: Array<Facet>;
  };
};

type UseSharedContactsFacets = () => {
  loading: boolean;
  data?: DstSharedContactsFacetsQuery['dstSharedContactsFacets'];
  error?: ApolloError;
  refetch: () => void;
};

const useSharedContactsFacets: UseSharedContactsFacets = () => {
  const selectedFacets = useReactiveVar(selectedFacetsVar);
  const searchQuery = useReactiveVar(searchQueryVar);
  const sortDetails = useReactiveVar(sortDetailsVar);

  const {
    data: facetsMetadata,
    loading: facetsMetadataLoading,
    error: facetsMetadataError,
    refetch: refetchFacetsMetadata,
  } = useFacetsMetadata();

  const { data, previousData, loading, error, refetch } = useQuery<
    DstSharedContactsFacetsQuery,
    { audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput }
  >(SHARED_CONTACTS_FACETS_QUERY, {
    skip: !facetsMetadata,
    variables: {
      audienceProfileRequestDTOInput: getAudienceProfileRequestDTOInput({
        sortKey: sortDetails.sortKey,
        sortOrder: sortDetails.sortOrder,
        start: 0,
        rows: 0,
        searchQuery,
        selectedFacets,
        facetsMetadata: facetsMetadata!,
      }),
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading: facetsMetadataLoading || loading,
    error: facetsMetadataError || error,
    data: data?.dstSharedContactsFacets || previousData?.dstSharedContactsFacets,
    refetch: facetsMetadataError ? refetchFacetsMetadata : refetch,
  };
};

export { useSharedContactsFacets };
