//lib
import { memo, useCallback, useMemo, useState } from 'react';

//components
import { MODAL_ACTIONS, ConfirmationModal } from '@sprinklr/modules/infra/components/confirmationModal';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//types
import { Intent } from '@sprinklr/spaceweb/types';

export type Props = {
  onHide: () => void;
  handleDeletion: ({
    successCallback,
    errorCallback,
  }: {
    successCallback: () => void;
    errorCallback: () => void;
  }) => void;
};

const DeleteConfirmationModal = ({ onHide, handleDeletion }: Props): JSX.Element => {
  const { __contactsT } = useContactsTranslation();

  const [deletionInProgress, setDeletionInProgress] = useState<boolean>(false);

  const onAction = useCallback(
    (action: Spr.Action): void => {
      switch (action.type) {
        case MODAL_ACTIONS.CONFIRM:
          setDeletionInProgress(true);

          handleDeletion({
            successCallback: () => setDeletionInProgress(false),
            errorCallback: () => setDeletionInProgress(false),
          });
          break;

        case MODAL_ACTIONS.HIDE:
          onHide();
          break;

        default:
          break;
      }
    },
    [handleDeletion, onHide]
  );

  const overrides = useMemo(
    () => ({
      ConfirmationButton: {
        props: {
          intent: 'error' as Intent,
          isLoading: deletionInProgress,
        },
      },
    }),
    [deletionInProgress]
  );

  return (
    <ConfirmationModal
      confirmationBtnLabel={__contactsT('Remove')}
      headerLabel={__contactsT('Remove Contacts')}
      confirmationMessage={__contactsT(
        'Are you sure you want to proceed with removing these contacts? This is an irreversible action.'
      )}
      onAction={onAction}
      overrides={overrides}
    />
  );
};

export default memo(DeleteConfirmationModal);
