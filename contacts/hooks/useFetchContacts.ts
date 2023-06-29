//lib
import { useMemo } from 'react';
import { DocumentNode } from '@apollo/client';

//queries
import { DST_ALL_CONTACTS } from '@/modules/contacts/queries';

//utils
import { getAdaptedContactsSocialProfiles } from '@/modules/contacts/utils/getAdaptedContactsSocialProfiles';

//constants
import snTypes from '@sprinklr/modules/infra/constants/snTypes';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

type QueryVariables = {
  searchRequest: {
    rows: number;
    filters?: Spr.StringTMap<string[]>;
  };
};

const useFetchContacts = (
  queryVariables: QueryVariables,
  query: DocumentNode = DST_ALL_CONTACTS
): { profiles: AudienceProfile[]; loading: boolean } => {
  const { data, loading } = useQuery<{
    dstAllContacts: { profiles: AudienceProfile[] };
  }>(query, {
    variables: queryVariables,
  });

  const adaptedProfiles = useMemo(
    () =>
      getAdaptedContactsSocialProfiles({
        contacts: data?.dstAllContacts?.profiles,
        selectedFacets: queryVariables.searchRequest.filters,
      }),
    [data, queryVariables]
  );

  return {
    profiles: adaptedProfiles,
    loading,
  };
};

export { useFetchContacts };
