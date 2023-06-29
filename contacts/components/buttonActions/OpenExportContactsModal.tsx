// libraries
import { useEffect, useState, memo, useCallback } from 'react';

// components
import { ExportContactsModal } from '../exportContactsModal';

// types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

const OpenExportContactsModal = (buttonActionProps: ButtonActionProps): Spr.Null<JSX.Element> => {
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

  return isOpen ? <ExportContactsModal onClose={onClose} /> : null;
};

const MemoizedOpenExportContactsModal = memo(OpenExportContactsModal);

export { MemoizedOpenExportContactsModal as OpenExportContactsModal };
