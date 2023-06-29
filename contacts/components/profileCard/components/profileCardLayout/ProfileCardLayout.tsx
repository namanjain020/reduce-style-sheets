// libs
import { ReactNode, Children, FC } from 'react';
import _noop from 'lodash/noop';

// components
import { Box, BoxProps } from '@sprinklr/spaceweb/box';

// types
import { ClassName } from '@sprinklr/spaceweb';

export const SLOT_NAMES = {
  LEFT_SECTION: 'leftSection',
  RIGHT_SECTION: 'rightSection',
} as const;

const ProfileCardSlots: FC<
  React.PropsWithChildren<{
    name: Spr.ValueOf<typeof SLOT_NAMES>;
    children?: React.ReactNode;
  }>
> = () => null;

const CARD_HEIGHT = 18;

const ProfileCardLayout = ({
  onContainerClick = _noop,
  containerClassName,
  containerProps,
  children,
}: {
  children: ReactNode;
  onContainerClick?: () => void;
  containerProps?: BoxProps;
  containerClassName?: ClassName;
}): JSX.Element => {
  const childrenArr = Children.toArray(children) as React.ReactElement[];

  const LeftSectionSlot = childrenArr.find((child: React.ReactElement) => child.props.name === SLOT_NAMES.LEFT_SECTION);

  const RightSectionSlot = childrenArr.find(
    (child: React.ReactElement) => child.props.name === SLOT_NAMES.RIGHT_SECTION
  );

  return (
    <Box
      data-testid="profileCard"
      className={[
        'w-full flex flex-col pt-4 px-4 spr-ui-01 rounded-8 overflow-hidden mb-4 border-1 border-transparent',
        { height: `${CARD_HEIGHT}rem` },
        containerClassName,
      ]}
      onClick={onContainerClick}
      {...containerProps}
    >
      <Box className="w-full h-full flex overflow-hidden">
        <Box className="flex flex-col gap-3 items-center flex-none">
          {LeftSectionSlot ? LeftSectionSlot.props.children : null}
        </Box>

        <Box className="flex flex-grow ml-5 min-w-0 flex-col w-full">
          {RightSectionSlot ? RightSectionSlot.props.children : null}
        </Box>
      </Box>
    </Box>
  );
};

ProfileCardLayout.Slot = ProfileCardSlots;

export default ProfileCardLayout;
