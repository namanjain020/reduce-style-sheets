//libs
import { memo, useState, useMemo } from 'react';

//components
import { ProfileAdditionForm } from './components/profileAdditionForm';
import { BulkProfilesAddition } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/bulkProfilesAddition';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//constants
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';

//types
import { OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

type Props = {
  onAction: OnAction;
  selectedChannels: Array<SnType>;
  addContactInProgress: boolean;
  channelInputValues: ChannelInputValues;
  onClose: () => void;
};

const MultiChannelsProfileAddition = ({
  selectedChannels,
  onAction,
  channelInputValues,
  addContactInProgress,
  onClose,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const [profileAdditionMode, setProfileAdditionMode] = useState<keyof typeof PROFILE_ADDITION_MODES>(
    PROFILE_ADDITION_MODES.SINGLE
  );

  const profileAdditionModeSelectorParams = useMemo(
    () => ({ mode: profileAdditionMode, onModeChange: setProfileAdditionMode }),
    [profileAdditionMode]
  );

  return profileAdditionMode === PROFILE_ADDITION_MODES.SINGLE ? (
    <ProfileAdditionForm
      selectedChannels={selectedChannels}
      onAction={onAction}
      channelInputValues={channelInputValues}
      addContactInProgress={addContactInProgress}
      profileAdditionMode={profileAdditionMode}
      setProfileAdditionMode={setProfileAdditionMode}
      onClose={onClose}
    />
  ) : (
    <BulkProfilesAddition
      selectedChannels={selectedChannels}
      onAction={onAction}
      onClose={onClose}
      title={__contactsT('Add Contact')}
      profileAdditionModeSelectorParams={profileAdditionModeSelectorParams}
    />
  );
};

export default memo(MultiChannelsProfileAddition);
