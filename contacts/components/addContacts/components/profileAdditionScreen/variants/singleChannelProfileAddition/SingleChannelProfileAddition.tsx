//libs
import { memo, useState, useMemo } from 'react';

//components
import { BulkProfilesAddition } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/bulkProfilesAddition';
import { ProfileAdditionForm } from './components/profileAdditionForm';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSprFeature } from '@space/core/contexts/sprEnv';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import { getChannelTypeVsParams } from './constants';
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';

//types
import { Props } from './types';

const SingleChannelProfileAddition = ({
  selectedChannels,
  onAction,
  channelInputValues,
  addContactInProgress,
  onClose,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { getValue } = useSprFeature();

  const { title, profileAdditionModeSelectorParams: _profileAdditionModeSelectorParams } = useMemo(
    () => getChannelTypeVsParams(__contactsT, getValue)[selectedChannels[0]] ?? EMPTY_OBJECT_READONLY,
    [__contactsT, getValue, selectedChannels]
  );

  const [profileAdditionMode, setProfileAdditionMode] = useState<keyof typeof PROFILE_ADDITION_MODES>(
    PROFILE_ADDITION_MODES.SINGLE
  );

  const profileAdditionModeSelectorParams = useMemo(
    () =>
      _profileAdditionModeSelectorParams
        ? { ..._profileAdditionModeSelectorParams, mode: profileAdditionMode, onModeChange: setProfileAdditionMode }
        : undefined,
    [_profileAdditionModeSelectorParams, profileAdditionMode]
  );

  return profileAdditionMode === PROFILE_ADDITION_MODES.SINGLE ? (
    <ProfileAdditionForm
      selectedChannels={selectedChannels}
      onAction={onAction}
      channelInputValues={channelInputValues}
      addContactInProgress={addContactInProgress}
      profileAdditionMode={profileAdditionMode}
      setProfileAdditionMode={setProfileAdditionMode}
    />
  ) : (
    <BulkProfilesAddition
      selectedChannels={selectedChannels}
      onAction={onAction}
      onClose={onClose}
      title={title}
      profileAdditionModeSelectorParams={profileAdditionModeSelectorParams}
    />
  );
};

export default memo(SingleChannelProfileAddition);
