//libs
import { useCallback, useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import _noop from 'lodash/noop';
import _isEmpty from 'lodash/isEmpty';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCreateContact } from '@/modules/contacts/components/addContacts/hooks/useCreateContact';

//utils
import { getProfileCreationRequest } from '@/modules/contacts/components/addContacts/hooks/useCreateContact/utils/getProfileCreationRequest';
import { getAdaptedChannelInputValues } from '@/modules/contacts/utils/getAdaptedChannelInputValues';

//helpers
import { isSearchedProfile } from '../helpers/isSearchedProfile';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//constants
import { ACTION_TYPES } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

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
  onClose,
}: {
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  onAction: OnAction;
  loading: boolean;
  error: Spr.Undefined<ApolloError>;
  data: UseSearchProfilesReturn['data'];
  onClose: () => void;
}): {
  bannerProps?: BannerProps;
  buttonParams?: ButtonProps & { label: string };
} => {
  const { __contactsT } = useContactsTranslation();

  const adaptedChannelInputValues = useMemo(
    () => getAdaptedChannelInputValues(channelInputValues),
    [channelInputValues]
  );

  const { createContact, loading: contactCreationInProgress } = useCreateContact({ onSuccessCallback: onClose });

  const profiles = data?.profiles;
  const contactStatus = data?.contactStatus;

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
          id: AudienceProfileEntity.getId(profiles![0]),
        },
      }),
    [onAction, profiles]
  );

  const handleMergeContacts = useCallback(
    () =>
      createContact({
        variables: {
          addToContacts: true,
          profileCreationRequest: getProfileCreationRequest({
            channelInputValues: adaptedChannelInputValues,
            profiles,
          }),
        },
      }),
    [adaptedChannelInputValues, createContact, profiles]
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

    if (error || _isEmpty(adaptedChannelInputValues)) {
      return {
        buttonParams: {
          disabled: true,
          label: __contactsT('Create Contact'),
        },
      };
    }

    if (profiles?.length === 0) {
      return {
        bannerProps: {
          intent: 'success' as BannerProps['intent'],
          title: __contactsT('Contact does not exist yet, you may proceed to create a new contact.'),
        },
        buttonParams: {
          onClick: goToNextScreen,
          label: __contactsT('Create Contact'),
        },
      };
    }

    if (profiles?.length === 1) {
      const profile = profiles[0];

      const areAllProfilesPartOfSameContact = Object.values(adaptedChannelInputValues).every(
        (searchedKeyword: string) =>
          isSearchedProfile({
            profile,
            searchedKeyword,
          })
      );

      const isContactAlreadyAdded = contactStatus?.[AudienceProfileEntity.getId(profile)];

      if (areAllProfilesPartOfSameContact) {
        if (isContactAlreadyAdded) {
          return {
            bannerProps: {
              intent: 'error' as BannerProps['intent'],
              title: __contactsT('Duplicate contact found, please try a different input.'),
            },
            buttonParams: {
              disabled: true,
              onClick: _noop,
              tooltipContent: __contactsT('Duplicate contact found, please try a different input.'),
              label: __contactsT('Add Contact'),
            },
          };
        }

        return {
          buttonParams: {
            onClick: handleAddContact,
            isLoading: addContactInProgress || contactCreationInProgress,
            label: __contactsT('Add Contact'),
          },
        };
      }
    }

    return {
      bannerProps: {
        intent: 'warning' as BannerProps['intent'],
        title: __contactsT(
          'Following contact already exists. If you proceed all social contacts would be merged. This is an irreversible action.'
        ),
      },
      buttonParams: {
        onClick: handleMergeContacts,
        isLoading: addContactInProgress || contactCreationInProgress,
        label: __contactsT('Add Contact'),
      },
    };
  }, [
    loading,
    error,
    adaptedChannelInputValues,
    profiles,
    __contactsT,
    handleMergeContacts,
    addContactInProgress,
    contactCreationInProgress,
    goToNextScreen,
    contactStatus,
    handleAddContact,
  ]);
};
