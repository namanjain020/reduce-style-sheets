//lib
import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import _difference from 'lodash/difference';

//mutation
import { EDIT_PROFILE_LIST } from '../../queries/editProfileList';

//hooks
import { useSprEnv } from '@/contexts/sprEnv/useSprEnv';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

type EditProfileList = ({
  profileIds,
  name,
  description,
}: {
  profileIds: Array<string>;
  name: string;
  description: string;
}) => void;

const useEditProfileList = ({
  id,
  profiles,
  onSuccess,
  onClose,
}: {
  id: string;
  profiles: Array<AudienceProfile>;
  onSuccess: () => void;
  onClose: () => void;
}): { editProfileList: EditProfileList; loading: boolean } => {
  const { __contactsT } = useContactsTranslation();

  const { onSuccess: onSuccessNotification, onError: onErrorNotification } = useSnackbarNotifications();

  const [_editProfileList, { loading }] = useMutation(EDIT_PROFILE_LIST);

  const ownerId = useSprEnv().userId;

  const editProfileList = useCallback(
    ({ profileIds, name, description }: any) => {
      const existingProfileIds = profiles.map(profile => profile.id);

      const profilesToRemove = _difference(existingProfileIds, profileIds);
      const profilesToAdd = _difference(profileIds, existingProfileIds);

      _editProfileList({
        variables: {
          clientProfileListId: id,
          dstProfileListDTO: {
            id,
            profilesToAdd,
            profilesToRemove,
            name,
            ownerId,
            description,
          },
        },
      })
        .then(() => {
          onSuccessNotification({
            message: __contactsT('I have updated the contact list.'),
          });

          onSuccess();
          onClose();
        })
        .catch(() =>
          onErrorNotification({
            message: __contactsT('I failed to update the contact list.'),
          })
        );
    },
    [
      profiles,
      _editProfileList,
      id,
      ownerId,
      onSuccessNotification,
      __contactsT,
      onSuccess,
      onClose,
      onErrorNotification,
    ]
  );

  return { editProfileList, loading };
};

export { useEditProfileList };
