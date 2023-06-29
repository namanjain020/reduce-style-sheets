//queries
import { FETCH_CLIENT_PROFILE_LISTS_QUERY } from '@/modules/contacts/queries';

//constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//hooks
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';

const useFetchProfileLists = (): { profileLists: Array<{ id: number; name: string }>; loading: boolean } => {
  const { data, loading } = useQuery<{
    clientProfileLists: Array<{ id: number; name: string }>;
  }>(FETCH_CLIENT_PROFILE_LISTS_QUERY);

  return {
    profileLists: data?.clientProfileLists ?? EMPTY_ARRAY_READONLY,
    loading,
  };
};

export { useFetchProfileLists };
