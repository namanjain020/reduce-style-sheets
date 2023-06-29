//lib
import { useCallback } from 'react';
import { useQuery } from '@apollo/client';

//hooks
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

//queries
import { FETCH_PROFILES_BY_PROFILE_LIST } from '../../profileList/queries/fetchProfilesByProfileList';

//utils
import { onError } from '@space/refluxActions/NotificationActions';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

type ResolvedData = {
  fetchAllProfilesByProfileList: Array<AudienceProfile>;
};

const useFetchProfilesByProfileList = (
  id: string,
  closeProfileList: () => void
): { profiles: Array<AudienceProfile>; loading: boolean } => {
  const { __commonT } = useCommonTranslation();

  const handleError = useCallback(() => {
    onError(__commonT('Something went wrong, please try again later!'));
    closeProfileList();
  }, [closeProfileList, __commonT]);

  const { data, loading } = useQuery<ResolvedData>(FETCH_PROFILES_BY_PROFILE_LIST, {
    variables: {
      profileListId: id,
    },
    onError: handleError,
  });

  return { profiles: data?.fetchAllProfilesByProfileList ?? [], loading };
};

export { useFetchProfilesByProfileList };
