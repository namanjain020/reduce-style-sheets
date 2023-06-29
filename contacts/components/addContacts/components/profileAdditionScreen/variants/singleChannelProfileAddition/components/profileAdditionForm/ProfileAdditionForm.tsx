//libs
import { memo, useMemo, SetStateAction, Dispatch } from 'react';

//components
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import { ChannelIconWithLabel } from '@/modules/contacts/components/addContacts/components/ChannelIconWithLabel';
import { ProfileAdditionModeSelector } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector';
import { Banner } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/Banner';
import { Footer } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/Footer';
import { PreviewCardsList } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/previewCardsList';
import { Input } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/input';
import CssTransition from '@space/core/components/cssTransition';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSearchProfiles } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/hooks/useSearchProfiles';
import { useProfileAdditionFormParams } from './hooks/useProfileAdditionFormParams';
import { useSprFeature } from '@space/core/contexts/sprEnv';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import { getChannelTypeVsParams } from '../../constants';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';

type Props = {
  selectedChannels: Array<SnType>;
  onAction: OnAction;
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  profileAdditionMode: keyof typeof PROFILE_ADDITION_MODES;
  setProfileAdditionMode: Dispatch<SetStateAction<Props['profileAdditionMode']>>;
};

const ProfileAdditionForm = ({
  selectedChannels,
  onAction,
  channelInputValues,
  addContactInProgress,
  profileAdditionMode,
  setProfileAdditionMode,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { getValue } = useSprFeature();

  const { title, profileCreationAllowed, warningMessage, profileAdditionModeSelectorParams } = useMemo(
    () => getChannelTypeVsParams(__contactsT, getValue)[selectedChannels[0]] ?? EMPTY_OBJECT_READONLY,
    [__contactsT, getValue, selectedChannels]
  );

  const { loading, error, refetch, data } = useSearchProfiles({
    channelInputValues,
  });

  const { bannerProps, buttonParams } = useProfileAdditionFormParams({
    channelInputValues,
    onAction,
    addContactInProgress,
    loading,
    error,
    data,
    warningMessage,
    profileCreationAllowed,
  });

  return (
    <ProfileAdditionLayout title={title}>
      <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
        <ChannelIconWithLabel channel={selectedChannels[0] as SnType} />

        {profileAdditionModeSelectorParams ? (
          <ProfileAdditionModeSelector
            mode={profileAdditionMode}
            onModeChange={setProfileAdditionMode}
            singleModeRadioLabel={profileAdditionModeSelectorParams.singleModeRadioLabel}
            bulkModeRadioLabel={profileAdditionModeSelectorParams.bulkModeRadioLabel}
          />
        ) : null}

        <CssTransition appear>
          <>
            <Input channels={selectedChannels} channelInputValues={channelInputValues} onAction={onAction} />

            {bannerProps ? <Banner bannerProps={bannerProps} /> : null}

            <PreviewCardsList
              loading={loading}
              error={error}
              refetch={refetch}
              profiles={data?.profiles ?? EMPTY_ARRAY_READONLY}
            />
          </>
        </CssTransition>
      </ProfileAdditionLayout.Slot>

      <ProfileAdditionLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Footer onAction={onAction} primaryButtonParams={buttonParams} />
      </ProfileAdditionLayout.Slot>
    </ProfileAdditionLayout>
  );
};

const MemoizedProfileAdditionForm = memo(ProfileAdditionForm);

export { MemoizedProfileAdditionForm as ProfileAdditionForm };
