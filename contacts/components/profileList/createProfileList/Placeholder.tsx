//libs
import _noop from 'lodash/noop';

//components
import Button from '@/components/button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sprinklr/spaceweb/modal';
import { Placeholder as EditorPlaceholder } from '@/modules/contacts/components/profileList/components/Placeholder';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

//constants
import { MODAL_OVERRIDES } from '@/modules/contacts/components/profileList/components/profileListEditor/constants';

const Placeholder = (): JSX.Element => {
  const { __contactsT } = useContactsTranslation();
  const { __commonT } = useCommonTranslation();

  return (
    <Modal isOpen size="md" onClose={_noop} overrides={MODAL_OVERRIDES} animate={false}>
      <ModalHeader>{__contactsT('Create New Contact List')}</ModalHeader>

      <ModalBody>
        <EditorPlaceholder />
      </ModalBody>

      <ModalFooter className="flex flex-row justify-end">
        <Button onClick={_noop} isLoading>
          {__commonT('Save')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { Placeholder };
