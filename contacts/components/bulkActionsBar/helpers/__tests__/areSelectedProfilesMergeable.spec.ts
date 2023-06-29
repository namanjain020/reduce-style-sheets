//helpers
import { areSelectedProfilesMergeable } from '../areSelectedProfilesMergeable';

//types
import { Profile } from '@/modules/contacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

describe('areSelectedProfilesMergeable', () => {
  test('should return false when at least one of the selected profiles does not contain any mergeable social profile', () => {
    const MOCK_PROFILES = [
      {
        socialProfiles: [
          {
            snType: 'TWITTER',
          },
          { snType: 'WHATSAPP_BUSINESS' },
        ],
      },
      {
        socialProfiles: [
          {
            snType: 'SMS',
          },
        ],
      },
    ] as unknown as Profile[];

    expect(
      areSelectedProfilesMergeable({
        profiles: MOCK_PROFILES,
        channelsAllowedToBeMerged: ['SMS', 'EMAIL'] as SnType[],
      })
    ).toEqual(false);
  });

  test('should return true when all of the selected profiles contain at least one mergeable social profile', () => {
    const MOCK_PROFILES = [
      {
        socialProfiles: [
          {
            snType: 'EMAIL',
          },
          { snType: 'WHATSAPP_BUSINESS' },
        ],
      },
      {
        socialProfiles: [
          {
            snType: 'SMS',
          },
        ],
      },
    ] as unknown as Profile[];

    expect(
      areSelectedProfilesMergeable({
        profiles: MOCK_PROFILES,
        channelsAllowedToBeMerged: ['SMS', 'EMAIL'] as SnType[],
      })
    ).toEqual(true);
  });
});
