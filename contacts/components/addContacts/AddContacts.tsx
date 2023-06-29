/**
 * Created by: Raj Meghpara
 * Date: 2021-08-06
 * Time: 13:40
 */

//libs
import { useMemo, memo } from 'react';

//components
import { ProfileAdditionScreen } from './components/profileAdditionScreen';
import { ContactCreationForm } from './components/contactCreationForm';
import { ProfileChannelsSelector } from './components/profileChannelsSelector';
import { Modal } from '@sprinklr/spaceweb/modal';

//hooks
import { useAddContacts } from './hooks/useAddContacts';

//constants
import { SCREEN_TYPES, CONTACT_MODAL_OVERRIDES } from './constants';

type Props = {
  show: boolean;
  onClose: () => void;
  onContactAddition: (contactsSubscriptionUpdated: boolean) => void;
};

const SCREEN_KEY_TO_COMPONENT = {
  [SCREEN_TYPES.PROFILE_CHANNELS_SELECTOR]: ProfileChannelsSelector,
  [SCREEN_TYPES.PROFILE_PREVIEW_SCREEN]: ProfileAdditionScreen,
  [SCREEN_TYPES.CONTACT_CREATION_SCREEN]: ContactCreationForm,
} as const;

const AddContacts = ({ show, onContactAddition, onClose }: Props): Spr.Null<JSX.Element> => {
  const {
    currentScreen,
    channelsData,
    onAction,
    loading,
    error,
    refetchChannelsData,
    selectedChannels,
    channelInputValues,
    addContactInProgress,
  } = useAddContacts({ onContactAddition, onClose });

  const Component = useMemo(
    () => (currentScreen ? SCREEN_KEY_TO_COMPONENT[currentScreen] : undefined),
    [currentScreen]
  );

  return Component ? (
    <Modal isOpen={show} onClose={onClose} overrides={CONTACT_MODAL_OVERRIDES}>
      <Component
        channelsData={channelsData}
        loading={loading}
        onAction={onAction}
        error={error}
        refetchChannelsData={refetchChannelsData}
        selectedChannels={selectedChannels}
        channelInputValues={channelInputValues}
        addContactInProgress={addContactInProgress}
        onClose={onClose}
      />
    </Modal>
  ) : null;
};

export default memo(AddContacts);
