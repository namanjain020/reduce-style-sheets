//libs
import { memo } from 'react';

//components
import { Box } from '@sprinklr/spaceweb/box';
import ChannelIcon from '@sprinklr/modules/infra/components/channelIcon/ChannelIcon';

//utils/readers
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getSocialProfileHandle } from '@sprinklr/modules/universalEntities/profile/helpers';
import { getName } from '@sprinklr/modules/universalEntities/profile/helpers/getName';

//constants
import { VARIANTS } from '@sprinklr/modules/infra/components/channelIcon/constants';

//types
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

type Props = {
  socialProfile: SocialProfile;
};

const SocialProfileInfo = ({ socialProfile }: Props): JSX.Element => {
  const name = getName(socialProfile);
  const snType = SocialProfileEntity.getSnType(socialProfile);
  const userName = getSocialProfileHandle(socialProfile);

  return (
    <Box className="flex flex-row gap-3 items-center">
      <Box className="whitespace-no-wrap flex-none">
        <ChannelIcon channel={snType} size={20} className="flex items-center" variant={VARIANTS.COLOURED_CIRCLE} />
      </Box>
      <Box className="flex flex-col flex-grow min-w-0">
        <Box $as="span" className="text-14 font-medium overflow-hidden truncate">
          {name}
        </Box>
        <Box $as="span" className="spr-text-02 text-12 overflow-hidden truncate">
          {userName}
        </Box>
      </Box>
    </Box>
  );
};

const MemoizedSocialProfileListItem = memo(SocialProfileInfo);
export { MemoizedSocialProfileListItem as SocialProfileInfo };
