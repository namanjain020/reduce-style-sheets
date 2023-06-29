//libs
import { memo } from 'react';

//components
import { Stack, StackItem } from '@sprinklr/spaceweb/stack';
import { Box } from '@sprinklr/spaceweb/box';
import { IconButton } from '@sprinklr/spaceweb/button';
import DeleteIcon from '@sprinklr/spaceweb-icons/solid/Delete';

//i18n
import { useContactsTranslation } from '@/modules/contacts/i18n';

type Props = {
  name: string;
  size: string;
  extension: string;
  onRemove: () => void;
};

const FilePreview = ({ name, size, extension, onRemove }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  return (
    <Stack direction="horizontal" className="p-4 rounded-12 spr-border-03 border-2 flex items-center" gap={3}>
      <StackItem shrink>
        <Box
          $as="span"
          className="h-12 w-12 flex items-center justify-center rounded-8 spr-text-06 font-600 spr-tooltip-01"
        >
          {extension.toUpperCase()}
        </Box>
      </StackItem>
      <Stack direction="vertical" gap={1} className="flex justify-center">
        <StackItem $as="span" className="text-14 font-500">
          {name}
        </StackItem>
        <StackItem $as="span" className="text-12 spr-text-02">
          {size}
        </StackItem>
      </Stack>
      <StackItem shrink className="flex items-center justify-center">
        <IconButton
          onClick={onRemove}
          shape="round"
          size="xs"
          tooltipContent={__contactsT('Remove file')}
          className="flex"
        >
          <DeleteIcon size={14} />
        </IconButton>
      </StackItem>
    </Stack>
  );
};

const MemoizedFilePreview = memo(FilePreview);

export { MemoizedFilePreview as FilePreview };
