// libs
import { useCallback, memo } from 'react';

// components
import { Box } from '@sprinklr/spaceweb/box';
import Button from '@/components/button';

// hooks
import { useCommonTranslation } from '@sprinklr/modules/sprI18Next';

// types
import { OnAction } from '@/modules/contacts/components/addContacts/types';
import { ButtonProps } from '@sprinklr/spaceweb/button';

// constants
import { ACTION_TYPES } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

const Footer = ({
  onAction,
  primaryButtonParams: { label, onClick, disabled, isLoading, tooltipContent } = EMPTY_OBJECT_READONLY,
}: {
  onAction: OnAction;
  primaryButtonParams?: ButtonProps & { label: string };
}): JSX.Element => {
  const { __commonT } = useCommonTranslation();

  const goToPreviousScreen = useCallback(
    () =>
      onAction({
        type: ACTION_TYPES.GO_TO_PREVIOUS_SCREEN,
        payload: EMPTY_OBJECT_READONLY,
      }),
    [onAction]
  );

  return (
    <Box className="flex justify-end gap-3">
      <Button onClick={goToPreviousScreen} variant="secondary">
        {__commonT('Back')}
      </Button>

      <Button onClick={onClick} disabled={disabled} isLoading={isLoading} tooltipContent={tooltipContent}>
        {label}
      </Button>
    </Box>
  );
};

const MemoizedFooter = memo(Footer);

export { MemoizedFooter as Footer };
