//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

export type ProfileCreationRequest = Partial<{
  socialProfilesMetadata: Array<{
    snType: SnType;
    snId: string;
  }>;
  profileAttributes: Spr.StringStringMap;
  profileIdsToMerge: Array<string>;
}>;
