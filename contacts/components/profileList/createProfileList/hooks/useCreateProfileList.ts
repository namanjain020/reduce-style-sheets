//lib
import { useCallback } from 'react';
import { useMutation, ApolloError } from '@apollo/client';

//mutation
import { CREATE_PROFILE_LIST } from '../../queries/createProfileList';

//utils
import { getErrorMessage } from '@sprinklr/modules/infra/utils/networkError';

//hooks
import { useSprEnv } from '@/contexts/sprEnv/useSprEnv';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';

//types
import { ProfileListInfo } from '../../types';
import { ProfileList } from '@space/modules/profileList/types';

type CreateProfileListVariables = {
  dstProfileListDTO: {
    profilesToAdd: Array<string>;
    name: string;
    ownerId: string;
    description?: string;
  };
};

type CreateProfileListResponse = {
  dstCreateClientProfileList: ProfileList;
};

type CreateProfileList = (
  profileListInfo: { profileIds: Array<string> } & Pick<ProfileListInfo, 'name' | 'description'>
) => void;

const useCreateProfileList = ({
  onSuccess,
}: {
  onSuccess: (profileList: ProfileList) => void;
}): { createProfileList: CreateProfileList; loading: boolean } => {
  const { __contactsT } = useContactsTranslation();

  const { onSuccess: onSuccessNotification, onError: onErrorNotification } = useSnackbarNotifications();

  const [_createProfileList, { loading }] = useMutation<CreateProfileListResponse, CreateProfileListVariables>(
    CREATE_PROFILE_LIST
  );

  const ownerId = useSprEnv().userId;

  const createProfileList = useCallback<CreateProfileList>(
    ({ profileIds, name, description }) => {
      _createProfileList({
        variables: {
          dstProfileListDTO: {
            profilesToAdd: profileIds,
            name,
            ownerId,
            description,
          },
        },
      })
        .then((response: { data: CreateProfileListResponse }) => {
          const profileList = response.data.dstCreateClientProfileList;

          onSuccessNotification({
            message: __contactsT('I have created the contact list.'),
          });

          onSuccess(profileList);
        })
        .catch((error: Spr.Undefined<ApolloError | Error>) =>
          onErrorNotification({
            message: getErrorMessage(error) ?? __contactsT('I failed to create the contact list.'),
          })
        );
    },
    [_createProfileList, ownerId, onSuccessNotification, __contactsT, onSuccess, onErrorNotification]
  );

  return { createProfileList, loading };
};

export { useCreateProfileList };
