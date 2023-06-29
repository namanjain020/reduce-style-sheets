//libs
import { useCallback } from 'react';
import { useMutation, MutationResult, MutationFunction, gql } from '@apollo/client';

// constants
import { AUDIENCE_PROFILE_FRAGMENT } from '@/modules/contacts/fragments';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { ProfileCreationRequest } from '@/modules/contacts/components/addContacts/hooks/useCreateContact/types';

const UPDATE_PROFILE = gql`
  mutation updateProfile($profileId: String!, $profileCreationRequest: ProfileCreationRequestV2Input!) {
    updateProfile: updateDstProfile(profileId: $profileId, profileCreationRequest: $profileCreationRequest) {
      ...AudienceProfile
    }
  }
  ${AUDIENCE_PROFILE_FRAGMENT}
`;

type Variables = {
  profileId: string;
  profileCreationRequest: ProfileCreationRequest;
};

type Response = {
  updateProfile?: AudienceProfile;
};

type Return = [MutationFunction<Response, Variables>, MutationResult<Response>];

const useUpdateProfile = ({ onSuccessCallback }: { onSuccessCallback?: () => void }): Return => {
  const { __contactsT } = useContactsTranslation();
  const { onError, onSuccess } = useSnackbarNotifications();

  const failureCallback = useCallback(
    () => onError({ message: __contactsT('I am unable to edit your contact!') }),
    [__contactsT, onError]
  );

  const successCallback = useCallback(() => {
    onSuccess({ message: __contactsT('I have edited your contact successfully!') });

    onSuccessCallback?.();
  }, [onSuccess, __contactsT, onSuccessCallback]);

  const [updateProfile, response] = useMutation<Response, Variables>(UPDATE_PROFILE, {
    onCompleted: successCallback,
    onError: failureCallback,
  });

  return [updateProfile, response];
};

export { useUpdateProfile };
