//libs
import { SyntheticEvent, memo } from 'react';

//components
import { Menu } from '@sprinklr/spaceweb/menu';
import { MenuItem } from '@sprinklr/modules/infra/components/interactiveAtoms/MenuItem';
import { SocialProfileInfo } from './SocialProfileInfo';

//entities
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//types
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

const MAX_HEIGHT = 23;

const MENU_ITEM_OVERRIDES = {
  ListItem: { props: { overrides: { ChildContainer: { props: { className: 'min-w-0' } } } } },
};

const SocialProfilesList = ({
  socialProfiles,
  onProfileClick,
}: {
  socialProfiles: Array<SocialProfile>;
  onProfileClick: (profile: SocialProfile) => void;
}): JSX.Element => (
  <Menu focusWhenNavigationEnabled={false} className={['py-1 overflow-y-auto', { maxHeight: `${MAX_HEIGHT}rem` }]}>
    {socialProfiles.map(
      (profile: SocialProfile): JSX.Element => (
        <MenuItem
          key={SocialProfileEntity.getSnId(profile)}
          onClick={(e: SyntheticEvent): void => {
            e.stopPropagation();
            onProfileClick(profile);
          }}
          className="py-1"
          overrides={MENU_ITEM_OVERRIDES}
          trackerEventId={`@contacts/profileSwitcher/${SocialProfileEntity.getSnId(profile)}`}
        >
          <SocialProfileInfo socialProfile={profile} />
        </MenuItem>
      )
    )}
  </Menu>
);

const MemoizedSocialProfileList = memo(SocialProfilesList);
export { MemoizedSocialProfileList as SocialProfilesList };
