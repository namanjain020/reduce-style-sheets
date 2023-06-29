//utils
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

export const getProfileOptions = (
  profiles: Array<AudienceProfile>
): Array<{ id: string; imageUrl: string; name: string }> =>
  profiles.map(profile => {
    const socialProfile = AudienceProfileEntity.getSocialProfiles(profile)[0];
    const id = AudienceProfileEntity.getId(profile);
    const name = SocialProfileEntity.getName(socialProfile) || SocialProfileEntity.getUserName(socialProfile) || '';
    const profileImageUrl = SocialProfileEntity.getProfileImageUrl(socialProfile);
    const largeProfileImageUrl = SocialProfileEntity.getLargeProfileImageUrl(socialProfile);

    return {
      id,
      name,
      imageUrl: profileImageUrl || largeProfileImageUrl,
    };
  });
