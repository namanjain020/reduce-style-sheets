//libs
import { memo, useCallback } from 'react';

//components
import { ProfilesUploader } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/bulkProfilesAddition/components/profilesUploader';
import {
  ProfileAdditionLayout,
  SLOT_NAMES,
} from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/profileAdditionLayout';
import CssTransition from '@space/core/components/cssTransition';
import { Modal } from '@sprinklr/spaceweb/modal';
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';
import { Banner, BannerItem } from '@sprinklr/spaceweb/banner';

//constants
import { CONTACT_MODAL_OVERRIDES } from '@/modules/contacts/components/addContacts/constants';

//hooks
// eslint-disable-next-line max-len -- valid use case
import { useImportAndUploadAudienceProfiles } from '@/modules/contacts/components/addContacts/components/profileAdditionScreen/components/bulkProfilesAddition/components/profilesUploader/hooks/useImportAndUploadAudienceProfiles';
import { useContactsTranslation } from '@/modules/contacts/i18n';

import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

type Props = {
  onClose: () => void;
};

const ImportProfilesModal = ({ onClose }: Props): JSX.Element => {
  const {
    importProfiles,
    loading: isProfilesUploadInProgress,
    uploadProfiles,
    removeFile,
    file,
  } = useImportAndUploadAudienceProfiles({
    onClose,
  });
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  const handleSubmit = useCallback(() => {
    if (file) {
      importProfiles({ file: file.data as File, fileExtension: file.extension });
    }
  }, [importProfiles, file]);

  return (
    <Modal isOpen onClose={onClose} overrides={CONTACT_MODAL_OVERRIDES}>
      <ProfileAdditionLayout title={__contactsT('Import Contacts')}>
        <ProfileAdditionLayout.Slot name={SLOT_NAMES.BODY}>
          <Banner intent="warning" collapsible title={__contactsT('Important Instructions for File Upload')} $as="ol">
            <BannerItem>{__contactsT('Please note that all fields are marked correctly.')}</BannerItem>
            <BannerItem>{__contactsT('Only SMS and Email contacts can be merged.')}</BannerItem>
            <BannerItem>
              {__contactsT(
                'After ingestion, Sprinklr will notify you of successful imports. Check the export file for failed entries and re-upload for contact creation.'
              )}
            </BannerItem>
          </Banner>

          <CssTransition appear>
            <ProfilesUploader removeFile={removeFile} onUpload={uploadProfiles} file={file} channelType={undefined} />
          </CssTransition>
        </ProfileAdditionLayout.Slot>

        <ProfileAdditionLayout.Slot name={SLOT_NAMES.FOOTER}>
          <Box className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary">
              {__commonT('Cancel')}
            </Button>

            <Button onClick={handleSubmit} disabled={!file} isLoading={isProfilesUploadInProgress}>
              {__commonT('Upload')}
            </Button>
          </Box>
        </ProfileAdditionLayout.Slot>
      </ProfileAdditionLayout>
    </Modal>
  );
};

const MemoizedImportProfilesModal = memo(ImportProfilesModal);
export { MemoizedImportProfilesModal as ImportProfilesModal };
