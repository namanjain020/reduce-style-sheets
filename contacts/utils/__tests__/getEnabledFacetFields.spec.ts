//utils
import { getEnabledFacetFields } from '../getEnabledFacetFields';

//types
import { FacetsMetadata } from '@/modules/contacts/types';

const MOCK_FACET_FIELDS = [
  {
    additional: {
      clientId: '1000004594',
    },
    displayName: 'Contact List',
    fieldType: 'FILTER',
    id: 'PROFILE_LIST',
    priority: 99,
    rangeFacet: false,
  },
  {
    additional: null,
    displayName: 'Partner Profile list',
    fieldType: 'FILTER',
    id: 'PARTNER_PROFILE_LIST',
    priority: 98,
    rangeFacet: false,
  },
] as FacetsMetadata;

describe('getEnabledFacetFields', () => {
  test('should return all `facetFields` when `enabledFacetFieldIds` is empty', () => {
    expect(getEnabledFacetFields(MOCK_FACET_FIELDS, [])).toEqual(MOCK_FACET_FIELDS);
  });

  test('should return enabled `facetFields` when `enabledFacetFieldIds` is non-empty', () => {
    expect(getEnabledFacetFields(MOCK_FACET_FIELDS, ['PROFILE_LIST'])).toEqual([
      {
        additional: {
          clientId: '1000004594',
        },
        displayName: 'Contact List',
        fieldType: 'FILTER',
        id: 'PROFILE_LIST',
        priority: 99,
        rangeFacet: false,
      },
    ]);
  });
});
