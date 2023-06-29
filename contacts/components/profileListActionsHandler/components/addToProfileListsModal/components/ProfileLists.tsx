//lib
import { memo, useCallback } from 'react';

//components
import { VirtualizedListWithWindowScroll } from '@/components/virtualizedList';
import { Box } from '@sprinklr/spaceweb/box';
import { Checkbox } from '@sprinklr/spaceweb/checkbox';
import { Placeholder } from './Placeholder';

//hoc
import { withTransientState } from './withTransientState';

//constants
import { ITEM_HEIGHT, ITEM_WIDTH } from '../constants';

//types
import { ProfileList } from '@space/modules/profileList/types';

type Props = {
  selectedProfileListIds: Array<string>;
  onProfileListChange: (profileList: ProfileList) => void;
  profileLists: Array<ProfileList>;
  loading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  scrollContainerEl: Spr.Null<HTMLElement>;
  isPaginating: boolean;
};

const itemIdGetter = (profileList: ProfileList): string => String(profileList.id);

const ProfileLists = ({
  selectedProfileListIds,
  onProfileListChange,
  profileLists,
  loading,
  hasMore,
  fetchMore,
  scrollContainerEl,
  isPaginating,
}: Props): Spr.Null<JSX.Element> => {
  const itemRenderer = useCallback(
    ({ item, loading: _loading }: { item: Spr.Undefined<ProfileList>; loading: boolean }): JSX.Element => {
      if (_loading || !item) return <Placeholder />;

      return (
        <Box className="hover:spr-ui-hover rounded-8">
          <Checkbox
            checked={selectedProfileListIds.includes(itemIdGetter(item))}
            onChange={() => onProfileListChange(item)}
            name={itemIdGetter(item)}
            className="flex-1 w-full p-3"
          >
            {item.name}
          </Checkbox>
        </Box>
      );
    },
    [onProfileListChange, selectedProfileListIds]
  );

  return scrollContainerEl ? (
    <VirtualizedListWithWindowScroll<ProfileList, Spr.StringAnyMap>
      items={profileLists}
      loading={loading}
      hasMore={hasMore}
      fetchMore={fetchMore}
      isFetchingMore={isPaginating}
      itemIdGetter={itemIdGetter}
      itemRenderer={itemRenderer}
      scrollContainerEl={scrollContainerEl}
      defaultItemHeight={ITEM_HEIGHT}
      width={ITEM_WIDTH}
    />
  ) : null;
};

const MemoizedProfileLists = withTransientState<Props>(memo(ProfileLists));

export { MemoizedProfileLists as ProfileLists };
