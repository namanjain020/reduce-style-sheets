/**
 * Created by: Raj Meghpara
 * Date: 2021-08-10
 * Time: 16:56
 */

//libs
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { useMutation, ApolloError } from '@apollo/client';
import { useQuery } from '@sprinklr/modules/infra/hooks/useQuery';
import { onSuccess, onError } from '@space/refluxActions/NotificationActions';

//hooks
import { useAsyncActions } from '@space/core/hooks/useAsyncActions';

//constants
import { CONTACT_SCREENS, SCREEN_TYPES } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import { GET_CONTACT_CHANNELS_DATA_QUERY, ADD_CONTACT_MUTATION } from '@/modules/contacts/queries';

//types
import { State, ChannelsData, ChannelInputValues } from '../types';
import { OnAction } from '@sprinklr/modules/infra/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

//actionHandlers
import { actionHandlers, initialState } from '@/modules/contacts/components/addContacts/actionHandlers';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { I18nextTFunction, useCommonTranslation } from '@sprinklr/modules/sprI18Next';

type Props = {
  onClose: () => void;
  onContactAddition: (contactsSubscriptionUpdated: boolean) => void;
};

type Return = {
  currentScreen: keyof typeof SCREEN_TYPES;
  channelsData: ChannelsData;
  error: Spr.Undefined<ApolloError>;
  refetchChannelsData: () => void;
  onAction: OnAction;
  selectedChannels: Array<SnType>;
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  loading: boolean;
};

const useAddContacts = ({ onContactAddition, onClose }: Props): Return => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const dispatch = useDispatch();
  const { data, loading, error, refetch: refetchChannelsData } = useQuery(GET_CONTACT_CHANNELS_DATA_QUERY);

  const contactChannelsData = data?.dstGetContactChannels ?? EMPTY_OBJECT_READONLY;

  const channelsData = useMemo(
    () => Object.keys(contactChannelsData).map(channel => ({ ...contactChannelsData[channel], id: channel })),
    [contactChannelsData]
  );

  const handleContactAddition = useCallback(
    (contactsSubscriptionUpdated: any) => {
      onClose();
      setTimeout(() => {
        onContactAddition(contactsSubscriptionUpdated);
      }, 1000);
    },
    [onClose, onContactAddition]
  );

  const onAddContactFailure = useCallback(
    () => onError(__contactsT('I am unable to add your contact!')),
    [__contactsT]
  );

  const onAddContactSuccess = useCallback(() => {
    handleContactAddition(true);
    onSuccess(__contactsT('I have added your contact successfully!'));
  }, [handleContactAddition, __contactsT]);

  const [addContact, { loading: addContactInProgress }] = useMutation(ADD_CONTACT_MUTATION, {
    onCompleted: onAddContactSuccess,
    onError: onAddContactFailure,
  });

  const { state, onAction } = useAsyncActions<
    State,
    {
      dispatch: Dispatch<Spr.Action>;
      handleContactAddition: (contactsSubscriptionUpdated: boolean) => void;

      addContact: ({ variables }: { variables: Spr.StringAnyMap }) => void;
      __contactsT: I18nextTFunction;
      __commonT: I18nextTFunction;
    }
  >({
    handlersMap: actionHandlers,
    initialState,
    params: { dispatch, handleContactAddition, addContact, __contactsT, __commonT },
  });

  const { selectedChannels, channelInputValues, currentScreenIndex } = state;
  const currentScreen = CONTACT_SCREENS[currentScreenIndex];

  return {
    currentScreen,
    channelsData,
    onAction,
    loading,
    error,
    refetchChannelsData,
    selectedChannels,
    channelInputValues,
    addContactInProgress,
  };
};

export { useAddContacts };
