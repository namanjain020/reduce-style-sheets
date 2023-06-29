//libs
import { memo, SetStateAction, Dispatch } from 'react';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useSearchProfiles } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/hooks/useSearchProfiles';
import { useProfileAdditionFormParams } from './hooks/useProfileAdditionFormParams';

//components
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import { ProfileAdditionModeSelector } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector';
import { Banner } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/Banner';
import { Footer } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/Footer';
import { PreviewCardsList } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/previewCardsList';
import { Input } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/input';
import CssTransition from '@space/core/components/cssTransition';

//constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';

//types
import { OnAction, ChannelInputValues } from '@/modules/contacts/components/addContacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

type Props = {
  selectedChannels: Array<SnType>;
  onAction: OnAction;
  channelInputValues: ChannelInputValues;
  addContactInProgress: boolean;
  profileAdditionMode: keyof typeof PROFILE_ADDITION_MODES;
  setProfileAdditionMode: Dispatch<SetStateAction<Props['profileAdditionMode']>>;
  onClose: () => void;
};

const ProfileAdditionForm = ({
  selectedChannels,
  onAction,
  channelInputValues,
  addContactInProgress,
  profileAdditionMode,
  setProfileAdditionMode,
  onClose,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { loading, error, refetch, data } = useSearchProfiles({
    channelInputValues,
  });

  const { bannerProps, buttonParams } = useProfileAdditionFormParams({
    onAction,
    channelInputValues,
    addContactInProgress,
    loading,
    error,
    data,
    onClose,
  });

  return (
    <ProfileAdditionLayout title={__contactsT('Add Contact')}>
      <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
        <ProfileAdditionModeSelector mode={profileAdditionMode} onModeChange={setProfileAdditionMode} />

        <CssTransition appear>
          <>
            <Input channels={selectedChannels} channelInputValues={channelInputValues} onAction={onAction} />

            {bannerProps ? <Banner bannerProps={bannerProps} /> : null}

            <PreviewCardsList
              profiles={data?.profiles ?? EMPTY_ARRAY_READONLY}
              loading={loading}
              error={error}
              refetch={refetch}
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
