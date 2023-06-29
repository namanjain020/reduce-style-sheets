//libs
import { memo, useMemo } from 'react';

//components
import { Box } from '@sprinklr/spaceweb/box';
import { FileUploader } from '@sprinklr/modules/infra/components/fileUploader';
import { FilePreview } from './FilePreview';
import { Typography } from '@sprinklr/spaceweb/typography';

//utils
import { formatBytes } from '@sprinklr/modules/infra/utils/formatBytes';

//constants
import MEDIA_TYPES from '@sprinklr/modules/infra/constants/mediaTypes';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import type { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import type { UploadResult, UploadedUppyFile } from '@uppy/core';

const FileExtension = ({ supportedFileExtensions }: { supportedFileExtensions: string[] }): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const supportedFileExtensionsList = useMemo(
    () =>
      supportedFileExtensions
        .map(extension => extension.slice(1))
        .join(', ')
        .toUpperCase(),
    [supportedFileExtensions]
  );

  return (
    <Typography className="spr-text-03 text-13 mb-1">
      {__contactsT('Supports: {{supportedFileExtensionsList}}', { supportedFileExtensionsList })}
    </Typography>
  );
};

const FILE_UPLOADER_OVERRIDES = {
  FileExtension,
};

const BODY_CLASS = ({ theme }) => ({ padding: theme.padding['4'], height: '100%' });

const ProfilesUploader = ({
  removeFile,
  onUpload,
  file,
  channelType,
  helpText,
}: {
  removeFile: () => void;
  onUpload: (params: UploadResult<Spr.StringAnyMap, Spr.StringAnyMap>) => void;
  file: Spr.Undefined<UploadedUppyFile<Spr.StringAnyMap, Spr.StringAnyMap>>;
} & Partial<{ channelType: SnType; helpText: string }>): JSX.Element => {
  const sampleFileUrl = useMemo(
    () => `/ui/rest/distributed/profile/import/sampleFile?channelType=${channelType}`,
    [channelType]
  );

  return (
    <Box data-testid="profilesUploaderBody" className="flex-1 flex flex-col gap-2">
      {helpText ? <Typography className="text-14 inline-block font-400">{helpText}</Typography> : null}
      <Box className="w-full flex-1">
        {file ? (
          <FilePreview
            //@ts-ignore
            name={file.data?.name}
            size={formatBytes(file.data?.size, 0)}
            extension={file.extension}
            onRemove={removeFile}
          />
        ) : (
          <FileUploader
            supportedMediaTypes={[MEDIA_TYPES.CSV, MEDIA_TYPES.XLS, MEDIA_TYPES.XLSX]}
            maxNumberOfFiles={1}
            onUpload={onUpload}
            bodyClassName={BODY_CLASS}
            overrides={FILE_UPLOADER_OVERRIDES}
            sampleTemplateSrc={sampleFileUrl}
          />
        )}
      </Box>
    </Box>
  );
};

export default memo(ProfilesUploader);
