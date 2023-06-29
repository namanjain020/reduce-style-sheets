//readers
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

//constants
import SN_TYPES_MAP from '@sprinklr/modules/infra/constants/snTypes';

//types
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

export const isSearchedProfile = ({
  profile,
  searchedKeyword,
}: {
  profile: Profile;
  searchedKeyword: Spr.Undefined<string>;
}): boolean => {
  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  return socialProfiles?.some((socialProfile: SocialProfile): boolean => {
    switch (SocialProfileEntity.getSnType(socialProfile)) {
      case SN_TYPES_MAP.TWITTER.type:
      case SN_TYPES_MAP.LINKEDIN.type:
        return SocialProfileEntity.getUserName(socialProfile) === searchedKeyword;

      default:
        return SocialProfileEntity.getSnId(socialProfile) === searchedKeyword;
    }
  });
};
