//lib
import { useEffect, useState, memo, useCallback } from 'react';

//components
import { CreateProfileList } from '@/modules/contacts/components/profileList/createProfileList';

//types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

const OpenCreateProfileListModal = (buttonActionProps: ButtonActionProps): Spr.Null<JSX.Element> => {
  const {
    onLoaded,
    onCompleted,
    actionDetails: {
      action: {
        payload: { onSuccess: _onSuccess },
      },
    },
  } = buttonActionProps;

  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCompleted();
  }, [onCompleted]);

  const onSuccess = useCallback(() => {
    _onSuccess();

    onCompleted();
  }, [_onSuccess, onCompleted]);

  useEffect(() => {
    onLoaded();
    setIsOpen(true);
  }, [setIsOpen, onLoaded]);

  return isOpen ? <CreateProfileList onHide={onClose} onSuccess={onSuccess} /> : null;
};

const MemoizedOpenCreateProfileListModal = memo(OpenCreateProfileListModal);

export { MemoizedOpenCreateProfileListModal as OpenCreateProfileListModal };
