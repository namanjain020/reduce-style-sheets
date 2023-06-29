//constant
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

export const splitProfileEntityId = (
  profileEntityId: Spr.Undefined<string>,
  separator: string
): {
  audienceProfileId: string;
  socialProfileIndex: string;
} => {
  const [audienceProfileId, socialProfileIndex] = profileEntityId?.split(separator) ?? EMPTY_ARRAY_READONLY;

  return { audienceProfileId, socialProfileIndex };
};
