//libs
import { ApolloError, useReactiveVar } from '@apollo/client';
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//hooks
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

//constants
import { MY_CONTACTS_FACETS_QUERY } from '@/modules/contacts/myContacts/queries';

//variables
import { selectedFacetsVar, searchQueryVar, sortDetailsVar } from '@/modules/contacts/myContacts/reactiveVariables';

//utils
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

//types
import { AudienceProfileRequestDTOInput, Facet } from '@/modules/contacts/types';

type DstMyContactsFacetsQuery = {
  dstMyContactsFacets: {
    facets: Array<Facet>;
  };
};

type UseMyContactsFacets = () => {
  loading: boolean;
  data?: DstMyContactsFacetsQuery['dstMyContactsFacets'];
  error?: ApolloError;
  refetch: () => void;
};

const useMyContactsFacets: UseMyContactsFacets = () => {
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
    DstMyContactsFacetsQuery,
    { audienceProfileRequestDTOInput: AudienceProfileRequestDTOInput }
  >(MY_CONTACTS_FACETS_QUERY, {
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
    data: data?.dstMyContactsFacets || previousData?.dstMyContactsFacets,
    refetch: facetsMetadataError ? refetchFacetsMetadata : refetch,
  };
};

export { useMyContactsFacets };
