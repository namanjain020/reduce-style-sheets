//entities
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';

//utils
import { getSocialProfileEntityId as getSocialProfileUniqueId } from '@sprinklr/modules/universalEntities/profile/helpers/general';

//types
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

export const SEPARATOR = '~';

export const getSocialProfileEntityId = (
  profile: Profile,
  selectedSocialProfile: SocialProfile
): Spr.Undefined<string> => {
  const audienceProfileId = AudienceProfileEntity.getId(profile);

  const socialProfileIndex = AudienceProfileEntity.getSocialProfiles(profile).findIndex(
    (socialProfile: SocialProfile) =>
      getSocialProfileUniqueId(socialProfile) === getSocialProfileUniqueId(selectedSocialProfile)
  );

  return audienceProfileId && socialProfileIndex !== -1
    ? [audienceProfileId, socialProfileIndex].join(SEPARATOR)
    : undefined;
};
