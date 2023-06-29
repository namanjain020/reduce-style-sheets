//lib
import UserImage from '@/components/userImage';

//utils
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import { getImageUrl } from '@sprinklr/modules/universalEntities/profile/helpers/getImageUrl';
import { getName } from '@sprinklr/modules/universalEntities/profile/helpers/getName';

//hooks
import { useSecureMediaUrl } from '@space/core/hooks/useSecureMediaUrl';

//types
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types/socialProfile';

const IMAGE_SIZE = 96;
const CHANNEL_ICON_SIZE = 24;

export const ProfileImage = ({ socialProfile }: { socialProfile: SocialProfile }): JSX.Element => {
  const profileImageUrl = useSecureMediaUrl(getImageUrl(socialProfile) as string);
  const name = getName(socialProfile) ?? '';
  const snType = SocialProfileEntity.getSnType(socialProfile);

  return (
    <UserImage
      src={profileImageUrl}
      name={name}
      snType={snType}
      size={IMAGE_SIZE}
      shape="circle"
      channelIconSize={CHANNEL_ICON_SIZE}
    />
  );
};
