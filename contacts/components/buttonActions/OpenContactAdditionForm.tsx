/**
 * Created by: Raj Meghpara
 * Date: 2022-01-11
 * Time: 11:35
 */

//lib
import { useEffect, useState, memo, useCallback } from 'react';

//components
import { AddContacts } from '@/modules/contacts/components/addContacts';

//hooks
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

//types
import { ButtonActionProps } from '@sprinklr/modules/platform/types';

const OpenContactAdditionForm = (buttonActionProps: ButtonActionProps): Spr.Null<JSX.Element> => {
  useBodyScrollLock();

  const {
    onLoaded,
    onCompleted,
    actionDetails: {
      action: {
        payload: { props },
      },
    },
  } = buttonActionProps;

  const [isOpen, setIsOpen] = useState(false);

  const closeContactAdditionForm = useCallback(() => {
    setIsOpen(false);
    onCompleted();
  }, [onCompleted]);

  useEffect(() => {
    onLoaded();
    setIsOpen(true);
  }, [setIsOpen, onLoaded]);

  return isOpen ? (
    <AddContacts show onClose={closeContactAdditionForm} onContactAddition={props.onContactAddition} />
  ) : null;
};

const MemoizedOpenContactAddtionForm = memo(OpenContactAdditionForm);

export { MemoizedOpenContactAddtionForm as OpenContactAdditionForm };
