//libs
import _isEmpty from 'lodash/isEmpty';

//components
import ActionsComponent from '@/components/messageActions';
import { Box } from '@sprinklr/spaceweb/box';

//types
import { ActionItems } from '@/types/engagementEntity';
import { onAction as ActionHandler } from '@/components/engagementEntity/universalCaseMessage/types';

export const ProfileCardActions = ({
  actionItems: { actions, primaryAction },
  onAction,
  loading,
  className,
}: {
  actionItems: ActionItems;
  onAction: ActionHandler;
  loading: boolean;
  className?: string;
}): Spr.Null<JSX.Element> =>
  loading || !_isEmpty(actions) || !_isEmpty(primaryAction) ? (
    <Box data-testid="profileCardFooter" className={[!loading ? 'py-4' : '', 'text-13 font-500', className]}>
      <ActionsComponent actions={actions} primaryAction={primaryAction} onAction={onAction} />
    </Box>
  ) : null;
