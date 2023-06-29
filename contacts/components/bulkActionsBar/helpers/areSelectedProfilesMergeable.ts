//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/SocialProfileEntity';

//types
import { Profile } from '@/modules/contacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

export const areSelectedProfilesMergeable = ({
  profiles,
  channelsAllowedToBeMerged,
}: {
  profiles: Array<Profile>;
  channelsAllowedToBeMerged: Array<SnType>;
}): boolean =>
  profiles.every((profile: Profile) => {
    const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

    return socialProfiles.some((socialProfile: SocialProfile) =>
      channelsAllowedToBeMerged.includes(SocialProfileEntity.getSnType(socialProfile))
    );
  });
