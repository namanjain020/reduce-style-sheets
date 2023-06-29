//types
import { ChannelInputValues } from '../../../types';
import { ProfileCreationRequest } from '../types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { Profile } from '@/modules/contacts/types';

//readers
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

export const getProfileCreationRequest = ({
  profileAttributes,
  channelInputValues,
  profiles,
}: {
  channelInputValues: Partial<Record<SnType, string>>;
} & Partial<{
  profileAttributes: Spr.StringStringMap;
  profiles: Array<Profile>;
}>): ProfileCreationRequest => {
  const socialProfilesMetadata = Object.keys(channelInputValues).map((channel: SnType) => ({
    snType: channel,
    snId: channelInputValues[channel]!,
  }));

  return {
    profileAttributes,
    profileIdsToMerge: profiles?.map(AudienceProfileEntity.getId),
    socialProfilesMetadata,
  };
};
