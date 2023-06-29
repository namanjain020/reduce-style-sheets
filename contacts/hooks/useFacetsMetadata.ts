//libs
import { useMemo } from 'react';
import { useQuery, ApolloError } from '@apollo/client';

//constants
import { FACETS_METADATA_QUERY } from '@/modules/contacts/queries';
import { APP_CONFIG_PROPERTY_TYPES } from '@/utils/propertyAppConfig';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//hooks
import { usePropertiesAppConfig } from '@/hooks/usePropertiesAppConfig';

//utils
import { getEnabledFacetFields } from '@/modules/contacts/utils/getEnabledFacetFields';
import { stripTypenames } from '@sprinklr/modules/infra/utils/stripTypenames';

//types
import { FacetsMetadata } from '@/modules/contacts/types';

type FacetsMetaDataQueryResponse = {
  facetsMetadata: FacetsMetadata;
};

type UseFacetsMetadata = () => {
  loading: boolean;
  data: Spr.Undefined<FacetsMetaDataQueryResponse['facetsMetadata']>;
  error: Spr.Undefined<ApolloError>;
  refetch: () => void;
};

const useFacetsMetadata: UseFacetsMetadata = () => {
  const { data, loading, error, refetch } = useQuery<FacetsMetaDataQueryResponse>(FACETS_METADATA_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const propertiesAppConfig = usePropertiesAppConfig();
  const enabledFacetFieldIds = propertiesAppConfig[APP_CONFIG_PROPERTY_TYPES.ENABLED_FACET_FIELDS_IN_CONTACTS];

  const facetFields = useMemo(
    () => stripTypenames(getEnabledFacetFields(data?.facetsMetadata || EMPTY_ARRAY_READONLY, enabledFacetFieldIds)),
    [data?.facetsMetadata, enabledFacetFieldIds]
  );

  return {
    data: facetFields,
    loading,
    error,
    refetch,
  };
};

export { useFacetsMetadata };
