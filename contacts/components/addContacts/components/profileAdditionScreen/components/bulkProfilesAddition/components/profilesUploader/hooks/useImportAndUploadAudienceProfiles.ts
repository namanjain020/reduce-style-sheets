//libs
import { useCallback, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import _isEmpty from 'lodash/isEmpty';

//hooks
import { useSnackbarNotifications } from '@/hooks/useSnackbarNotifications';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { FileUploaderProps } from '@sprinklr/modules/infra/components/fileUploader';

//types
import type { UploadedUppyFile } from '@uppy/core';

const PROFILES_IMPORT_MUTATION = gql`
  mutation importProfile($file: UploadFileScalar, $fileExtension: String!) {
    importProfile(file: $file, fileExtension: $fileExtension)
  }
`;

type Return = {
  importProfiles: ({ fileExtension, file }: { fileExtension: string; file: File }) => void;
  loading: boolean;
  uploadProfiles: (params: { successful?: Array<Spr.StringAnyMap> }) => void;
  removeFile: () => void;
  file: UploadedUppyFile<Spr.StringAnyMap, Spr.StringAnyMap> | undefined;
};

const useImportAndUploadAudienceProfiles = ({ onClose }: { onClose: () => void }): Return => {
  const [file, setFile] = useState<UploadedUppyFile<Spr.StringAnyMap, Spr.StringAnyMap> | undefined>(undefined);

  const { onSuccess, onError } = useSnackbarNotifications();
  const { __contactsT } = useContactsTranslation();

  const handleProfilesAddition = useCallback(() => {
    onSuccess({
      message: __contactsT("Your import request has been received. We will notify you after it's processed."),
    });
    onClose();
  }, [onClose, onSuccess, __contactsT]);

  const handleError = useCallback(() => {
    onError({ message: __contactsT('Your import request has failed. Please try again later.') });
  }, [onError, __contactsT]);

  const [importProfiles, { loading }] = useMutation(PROFILES_IMPORT_MUTATION, {
    onCompleted: handleProfilesAddition,
    onError: handleError,
  });

  const _importProfiles = useCallback(
    async ({ fileExtension, file: _file }: { fileExtension: string; file: File }) => {
      await importProfiles({ variables: { file: { file: _file }, fileExtension } });
    },
    [importProfiles]
  );

  const uploadProfiles: FileUploaderProps['onUpload'] = useCallback(({ successful }) => {
    if (!_isEmpty(successful)) {
      const _file = successful[0];
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        async function () {
          if (reader.result) {
            setFile(_file);
          }
        },
        false
      );
      reader.readAsDataURL(_file.data);
    }
  }, []);

  const removeFile = useCallback(() => setFile(undefined), []);

  return { importProfiles: _importProfiles, loading, uploadProfiles, removeFile, file };
};

export { useImportAndUploadAudienceProfiles };
