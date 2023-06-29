// utils
import { getAdaptedContactsSocialProfiles } from '@/modules/contacts/utils/getAdaptedContactsSocialProfiles';

// types
import { Profile } from '@/modules/contacts/types';

const MOCK_SELECTED_FACETS_WITHOUT_SN_TYPE = {};

const MOCK_SELECTED_FACETS_WITH_EMPTY_SN_TYPE = {
  SN_TYPE: [],
};

const MOCK_SELECTED_FACETS = {
  SN_TYPE: ['SPRINKLR_LIVE_CHAT'],
};

const MOCK_CONTACTS = [
  {
    id: '1',
    socialProfiles: [
      {
        type: 'VIBER',
      },
      {
        type: 'SPRINKLR_LIVE_CHAT',
      },
    ],
  },
  {
    id: '2',
    socialProfiles: [
      {
        type: 'YOUTUBE',
      },
      {
        type: 'SPRINKLR_LIVE_CHAT',
      },
    ],
  },
] as unknown as Profile[];

const MOCK_MATCHED_CONTACTS = [
  {
    id: '1',
    socialProfiles: [
      {
        type: 'SPRINKLR_LIVE_CHAT',
      },
      {
        type: 'VIBER',
      },
    ],
  },
  {
    id: '2',
    socialProfiles: [
      {
        type: 'SPRINKLR_LIVE_CHAT',
      },
      {
        type: 'YOUTUBE',
      },
    ],
  },
] as unknown as Profile[];

describe('getAdaptedContactsSocialProfiles()', () => {
  test('should return the same contacts when there is no social network facet', () => {
    const contacts = getAdaptedContactsSocialProfiles({
      contacts: MOCK_CONTACTS,
      selectedFacets: MOCK_SELECTED_FACETS_WITHOUT_SN_TYPE,
    });

    expect(contacts).toEqual(MOCK_CONTACTS);
  });

  test('should return the same contacts when there is a social network facet but none has been selected', () => {
    const contacts = getAdaptedContactsSocialProfiles({
      contacts: MOCK_CONTACTS,
      selectedFacets: MOCK_SELECTED_FACETS_WITH_EMPTY_SN_TYPE,
    });

    expect(contacts).toEqual(MOCK_CONTACTS);
  });

  test('should return the contacts with a matching social profile at the start for each audience profile', () => {
    const contacts = getAdaptedContactsSocialProfiles({
      contacts: MOCK_CONTACTS,
      selectedFacets: MOCK_SELECTED_FACETS,
    });

    expect(contacts).toEqual(MOCK_MATCHED_CONTACTS);
  });
});
