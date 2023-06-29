//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

export type ProfileListInfo = {
  name: string;
  profiles: Array<AudienceProfile>;
  description: string;
};
