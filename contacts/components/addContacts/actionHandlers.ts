/**
 * Created by: Raj Meghpara
 * Date: 2021-08-05
 * Time: 18:05
 */

//constants
import { ACTION_TYPES, LOADING_STATUS } from './constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//utils
import { onError } from '@space/refluxActions/NotificationActions';

const onAddContactError = (setState, __contactsT) => {
  onError(__contactsT('I am unable to add your contact!'));
  setState({ addContactStatus: LOADING_STATUS.LOADED });
};

export const initialState = {
  currentScreenIndex: 0,
  selectedChannels: EMPTY_ARRAY_READONLY,
  channelInputValues: EMPTY_OBJECT_READONLY,
};

export const actionHandlers = {
  [ACTION_TYPES.SELECT_CHANNELS]: (action, { setState }) =>
    setState({
      selectedChannels: action.payload?.selectedChannels,
      channelInputValues: initialState.channelInputValues,
    }),

  [ACTION_TYPES.GO_TO_NEXT_SCREEN]: (action, { setState, getState }) => {
    const { currentScreenIndex } = getState();

    setState({ currentScreenIndex: currentScreenIndex + 1 });
  },
  [ACTION_TYPES.GO_TO_PREVIOUS_SCREEN]: (action, { setState, getState }) => {
    const { currentScreenIndex } = getState();

    setState({ currentScreenIndex: currentScreenIndex - 1 });
  },

  [ACTION_TYPES.CHANGE_CHANNEL_INPUT_VALUES]: (action, { setState }) =>
    setState({ channelInputValues: action.payload?.channelInputValues }),

  [ACTION_TYPES.ADD_CONTACT]: async (action, { params, setState }) => {
    const { id } = action.payload;
    const { addContact, __contactsT } = params;

    try {
      addContact({
        variables: {
          universalProfileIds: [id],
        },
      });
    } catch (e) {
      onAddContactError(setState, __contactsT);
    }
  },
};
