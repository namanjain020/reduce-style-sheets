//lib
import { useEffect, useState, memo, useCallback } from 'react';

//components
import { ImportProfilesModal } from '@/modules/contacts/components/importProfilesModal';

//types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

const OpenImportProfilesModal = (buttonActionProps: ButtonActionProps): Spr.Null<JSX.Element> => {
  const { onLoaded, onCompleted } = buttonActionProps;

  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCompleted();
  }, [onCompleted]);

  useEffect(() => {
    onLoaded();
    setIsOpen(true);
  }, [setIsOpen, onLoaded]);

  return isOpen ? <ImportProfilesModal onClose={onClose} /> : null;
};

const MemoizedOpenImportProfilesModal = memo(OpenImportProfilesModal);

export { MemoizedOpenImportProfilesModal as OpenImportProfilesModal };
