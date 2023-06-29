//libs
import { useCallback, useMemo } from 'react';
import _noop from 'lodash/noop';
import _isEmpty from 'lodash/isEmpty';
import { ApolloError } from '@apollo/client';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//constants
import { ACTION_TYPES } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//types
import { OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';
import { BannerProps } from '@sprinklr/spaceweb/banner';
import { ButtonProps } from '@sprinklr/spaceweb/button';
import { Return as UseSearchProfilesReturn } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/hooks/useSearchProfiles';

export const useProfileAdditionFormParams = ({
  channelInputValues,
  onAction,
  addContactInProgress,
  loading,
  error,
  data,
  warningMessage,
  profileCreationAllowed,
}: {
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  onAction: OnAction;
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  data: UseSearchProfilesReturn['data'];
  warningMessage?: string;
  profileCreationAllowed: boolean;
}): {
  bannerProps?: BannerProps;
  buttonParams?: ButtonProps & { label: string };
} => {
  const { __contactsT } = useContactsTranslation();

  const profiles = data?.profiles ?? EMPTY_ARRAY_READONLY;

  const goToNextScreen = useCallback(
    () =>
      onAction({
        type: ACTION_TYPES.GO_TO_NEXT_SCREEN,
        payload: EMPTY_OBJECT_READONLY,
      }),
    [onAction]
  );

  const handleAddContact = useCallback(
    () =>
      onAction({
        type: ACTION_TYPES.ADD_CONTACT,
        payload: {
          id: AudienceProfileEntity.getId(profiles[0]),
        },
      }),
    [onAction, profiles]
  );

  return useMemo<
    Partial<{
      bannerProps: BannerProps;
      buttonParams: ButtonProps & { label: string };
    }>
  >(() => {
    if (loading) {
      return {
        buttonParams: {
          isLoading: true,
          label: __contactsT('Create Contact'),
        },
      };
    }

    if (error || _isEmpty(channelInputValues)) {
      return {
        buttonParams: {
          disabled: true,
          label: __contactsT('Create Contact'),
        },
      };
    }

    if (profiles.length === 0) {
      return {
        bannerProps: {
          intent: profileCreationAllowed ? ('success' as BannerProps['intent']) : ('error' as BannerProps['intent']),
          title: warningMessage ?? __contactsT('Contact does not exist yet, you may proceed to create a new contact.'),
        },
        buttonParams: profileCreationAllowed
          ? {
              onClick: goToNextScreen,
              label: __contactsT('Create Contact'),
            }
          : {
              disabled: true,
              onClick: _noop,
              label: __contactsT('Add Contact'),
              tooltipContent: warningMessage ?? '',
            },
      };
    }

    const profileAlreadyAddedInMyContacts = data?.contactStatus?.[AudienceProfileEntity.getId(profiles[0])];

    if (profileAlreadyAddedInMyContacts) {
      return {
        bannerProps: {
          intent: 'error' as BannerProps['intent'],
          title: __contactsT('Duplicate contact found, please try a different input.'),
        },
        buttonParams: {
          disabled: true,
          onClick: _noop,
          label: __contactsT('Create Contact'),
          tooltipContent: __contactsT('Duplicate contact found, please try a different input.'),
        },
      };
    }

    return {
      buttonParams: {
        onClick: handleAddContact,
        isLoading: addContactInProgress,
        label: __contactsT('Add Contact'),
      },
    };
  }, [
    __contactsT,
    addContactInProgress,
    channelInputValues,
    data?.contactStatus,
    error,
    goToNextScreen,
    handleAddContact,
    loading,
    profileCreationAllowed,
    warningMessage,
    profiles,
  ]);
};
