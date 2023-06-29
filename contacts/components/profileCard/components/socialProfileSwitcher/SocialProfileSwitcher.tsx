//libs
import { useCallback, useMemo, memo, SyntheticEvent } from 'react';

//components
import ChannelIcon from '@sprinklr/modules/infra/components/channelIcon/ChannelIcon';
import { BaseButton } from '@sprinklr/spaceweb/base-button';
import { StatefulPopover } from '@sprinklr/spaceweb/popover';
import { SocialProfilesList } from './components/SocialProfilesList';
import { Box } from '@sprinklr/spaceweb/box';

//icons
import ChevronDownIcon from '@sprinklr/spaceweb-icons/line/ChevronDown';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';

//entities/utils
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getSnProfileKey } from '@space/core/utils/audienceProfile';

//constants
import { VARIANTS } from '@sprinklr/modules/infra/components/channelIcon/constants';

//types
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

type Props = {
  socialProfiles: Array<SocialProfile>;
  socialProfile: SocialProfile;
  onProfileSwitch: (socialProfile: SocialProfile) => void;
};

const WIDTH = 200;
const MARGIN_TOP = 8;
const CHANNEL_ICON_SIZE = 12;
const CHEVRON_SIZE = 8;

const stopPropagation = (e: SyntheticEvent): void => e.stopPropagation();

const STATEFUL_TOOLTIP_OVERRIDES = {
  Body: {
    style: {
      width: `${WIDTH}px`,
      marginTop: `${MARGIN_TOP}px`,
    },
  },
};

const SocialProfileSwitcher = ({ socialProfiles, socialProfile, onProfileSwitch }: Props): Spr.Null<JSX.Element> => {
  const { __contactsT } = useContactsTranslation();

  const snType = SocialProfileEntity.getSnType(socialProfile);

  const filteredSocialProfiles = useMemo(
    () =>
      socialProfiles.filter((profile: SocialProfile) => getSnProfileKey(profile) !== getSnProfileKey(socialProfile)),
    [socialProfile, socialProfiles]
  );

  return socialProfiles.length > 1 ? (
    <Box onClick={stopPropagation}>
      <StatefulPopover
        placement="bottom"
        showArrow
        overrides={STATEFUL_TOOLTIP_OVERRIDES}
        content={({ close }): JSX.Element => (
          <SocialProfilesList
            socialProfiles={filteredSocialProfiles}
            onProfileClick={(profile: SocialProfile): void => {
              onProfileSwitch(profile);

              close();
            }}
          />
        )}
      >
        {({ isOpen }): JSX.Element => (
          <BaseButton
            aria-label={__contactsT('Switch Profile')}
            type="button"
            className="border-1 p-1 border-solid rounded-4 spr-border-03 flex justify-center items-center"
            data-testid="profile-switcher"
          >
            <ChannelIcon
              channel={snType}
              size={CHANNEL_ICON_SIZE}
              className="mr-1"
              variant={VARIANTS.COLOURED_CIRCLE}
            />
            <ChevronDownIcon
              size={CHEVRON_SIZE}
              className={[
                'transform',
                isOpen ? 'rotate-180' : 'rotate-0',
                { transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' },
              ]}
            />
          </BaseButton>
        )}
      </StatefulPopover>
    </Box>
  ) : null;
};

export default memo(SocialProfileSwitcher);
