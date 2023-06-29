//libs
import _noop from 'lodash/noop';

//components
import ContentTombstone from '@space/core/components/contentTombstone/ContentTombstone';
import { Stack } from '@sprinklr/spaceweb/stack';
import { ModalBody, ModalFooter, ModalHeader } from '@sprinklr/spaceweb/modal';
import Button from '@/components/button';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  return (
    <>
      <ModalHeader className="text-20">{__contactsT('Select Channel')}</ModalHeader>

      <ModalBody>
        <Stack direction="vertical" gap={0} data-testid="profileChannelSelectorPlaceholder">
          <ContentTombstone width="100%" height={80}>
            <rect x="76" y="36" rx="8" ry="8" width="32%" height="20" />
            <circle cx="38" cy="45" r="12" />
          </ContentTombstone>

          <ContentTombstone width="100%" height={80}>
            <rect x="76" y="36" rx="8" ry="8" width="32%" height="20" />
            <circle cx="38" cy="45" r="12" />
          </ContentTombstone>

          <ContentTombstone width="100%" height={80}>
            <rect x="76" y="36" rx="8" ry="8" width="32%" height="20" />
            <circle cx="38" cy="45" r="12" />
          </ContentTombstone>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button size="md" onClick={_noop} isLoading>
          {__commonT('Next')}
        </Button>
      </ModalFooter>
    </>
  );
};

export { Placeholder };
