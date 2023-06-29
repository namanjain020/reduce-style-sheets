//utils
import { getSocialProfileEntityId } from '../getSocialProfileEntityId';

//types
import { Profile } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

describe('getSocialProfileEntityId', () => {
  test("should return social profile entity id '{audienceProfileId}~{socialProfileIndex}' if audienceProfileId, selectedSocialProfile is present", () => {
    expect(
      getSocialProfileEntityId(
        {
          id: '63862aaa63826836823',
          socialProfiles: [
            { snType: 'TWITTER', snId: '6443484783279298' },
            { snType: 'TWITTER', snId: '6443484783279238' },
          ],
        } as Profile,
        { snType: 'TWITTER', snId: '6443484783279238' } as SocialProfile
      )
    ).toEqual('63862aaa63826836823~1');
  });

  test('should return undefined if audienceProfileId is undefined', () => {
    expect(
      getSocialProfileEntityId(
        {
          socialProfiles: [
            { snType: 'TWITTER', snId: '6443484783279298' },
            { snType: 'TWITTER', snId: '6443484783279238' },
          ],
        } as Profile,
        { snType: 'TWITTER', snId: '6443484783279238' } as SocialProfile
      )
    ).toEqual(undefined);
  });

  test('should return undefined if selectedSocialProfile is not present in audience profile', () => {
    expect(
      getSocialProfileEntityId(
        {
          id: '63862aaa63826836823',
          socialProfiles: [
            { snType: 'TWITTER', snId: '6443484783279298' },
            { snType: 'TWITTER', snId: '6443484783279238' },
          ],
        } as Profile,
        { snId: '6443484783279238', snType: 'FACEBOOK' } as SocialProfile
      )
    ).toEqual(undefined);
  });
});
