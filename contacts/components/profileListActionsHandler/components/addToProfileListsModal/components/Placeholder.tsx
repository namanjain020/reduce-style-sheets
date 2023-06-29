//libs
import _range from 'lodash/range';

//components
import { ContentTombstone } from '@sprinklr/modules/infra/components/contentTombstone';

//constants
import { ITEM_HEIGHT, ITEM_WIDTH } from '../constants';

export const Placeholder = ({ count = 1 }: { count?: number }): JSX.Element => (
  <>
    {_range(count).map((id: number) => (
      <ContentTombstone key={id} width={`${ITEM_WIDTH}px`} height={`${ITEM_HEIGHT}px`}>
        <rect x="10" y="9" rx="4" ry="4" width={16} height={16} />
        <rect x="36" y="8" rx="4" ry="4" width={100} height={18} />
      </ContentTombstone>
    ))}
  </>
);
