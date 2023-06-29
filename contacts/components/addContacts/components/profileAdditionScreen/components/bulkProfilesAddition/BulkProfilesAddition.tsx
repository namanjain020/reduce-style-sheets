/* Created by Gaurav on 09/11/2022 */

//lib
import { memo, useCallback, useMemo, Dispatch, SetStateAction } from 'react';

//components
import { ProfilesUploader } from './components/profilesUploader';
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import { Footer } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/Footer';
import { ChannelIconWithLabel } from '@/modules/contacts/components/addContacts/components/ChannelIconWithLabel';
import { ProfileAdditionModeSelector } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector';
import CssTransition from '@space/core/components/cssTransition';

//types
import type { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import type { OnAction } from '@/modules/contacts/components/addContacts/types';

//constants
import { PROFILE_ADDITION_MODES } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionModeSelector/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

//hooks
import { useImportAndUploadAudienceProfiles } from './components/profilesUploader/hooks/useImportAndUploadAudienceProfiles';
import { useContactsTranslation } from '@/modules/contacts/i18n';

type Props = {
  selectedChannels: Array<SnType>;
  onClose: () => void;
  onAction: OnAction;
  title: string;
  profileAdditionModeSelectorParams: Spr.Undefined<{
    mode: keyof typeof PROFILE_ADDITION_MODES;
    onModeChange: Dispatch<SetStateAction<keyof typeof PROFILE_ADDITION_MODES>>;
    singleModeRadioLabel?: string;
    bulkModeRadioLabel?: string;
  }>;
};

const BulkProfilesAddition = ({
  selectedChannels,
  onClose,
  onAction,
  title,
  profileAdditionModeSelectorParams,
}: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const { mode, onModeChange, singleModeRadioLabel, bulkModeRadioLabel } =
    profileAdditionModeSelectorParams ?? EMPTY_OBJECT_READONLY;

  const {
    importProfiles,
    loading: isProfilesUploadInProgress,
    uploadProfiles,
    removeFile,
    file,
  } = useImportAndUploadAudienceProfiles({
    onClose,
  });

  const handleSubmit = useCallback(() => {
    if (file) {
      importProfiles({ file: file.data as File, fileExtension: file.extension });
    }
  }, [importProfiles, file]);

  const primaryButtonParams = useMemo(
    () => ({
      disabled: !file,
      onClick: handleSubmit,
      isLoading: isProfilesUploadInProgress,
      label: __contactsT('Save and Add Contacts'),
    }),
    [__contactsT, file, handleSubmit, isProfilesUploadInProgress]
  );

  return (
    <ProfileAdditionLayout title={title}>
      <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
        {selectedChannels.length === 1 ? <ChannelIconWithLabel channel={selectedChannels[0] as SnType} /> : null}

        <ProfileAdditionModeSelector
          mode={mode}
          onModeChange={onModeChange}
          singleModeRadioLabel={singleModeRadioLabel}
          bulkModeRadioLabel={bulkModeRadioLabel}
        />

        <CssTransition appear>
          <>
            <ProfilesUploader
              removeFile={removeFile}
              onUpload={uploadProfiles}
              file={file}
              channelType={selectedChannels[0]}
              helpText={__contactsT('Upload a file with information about multiple contacts')}
            />
          </>
        </CssTransition>
      </ProfileAdditionLayout.Slot>

      <ProfileAdditionLayout.Slot name={SLOT_NAMES.FOOTER}>
        <Footer onAction={onAction} primaryButtonParams={primaryButtonParams} />
      </ProfileAdditionLayout.Slot>
    </ProfileAdditionLayout>
  );
};

const MemoizedBulkProfilesAddition = memo(BulkProfilesAddition);
export { MemoizedBulkProfilesAddition as BulkProfilesAddition };
