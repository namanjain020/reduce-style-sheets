//lib
import { useEffect, useState, memo, useCallback } from 'react';

//components
import { EditProfileList } from '@/modules/contacts/components/profileList/editProfileList';

//types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

const OpenEditProfileListModal = (buttonActionProps: ButtonActionProps): Spr.Null<JSX.Element> => {
  const {
    onLoaded,
    onCompleted,
    actionDetails: {
      action: {
        payload: { id, profileListInfo, onSuccess },
      },
    },
  } = buttonActionProps;

  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCompleted();
  }, [onCompleted]);

  useEffect(() => {
    onLoaded();
    setIsOpen(true);
  }, [setIsOpen, onLoaded]);

  return isOpen ? (
    <EditProfileList id={id} profileListInfo={profileListInfo} onClose={onClose} onSuccess={onSuccess} />
  ) : null;
};

const MemoizedOpenEditProfileListModal = memo(OpenEditProfileListModal);

export { MemoizedOpenEditProfileListModal as OpenEditProfileListModal };
