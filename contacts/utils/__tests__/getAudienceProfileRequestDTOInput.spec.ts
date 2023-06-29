//utils
import { __testGetSelectedFilters as getSelectedFilters } from '../getAudienceProfileRequestDTOInput';

//types
import { FacetsMetadata } from '@/modules/contacts/types';

const MOCK_FACET_FIELDS = [
  {
    id: 'SN_TYPE',
    displayName: 'Social Network',
    fieldType: 'FILTER',
    rangeFacet: false,
    priority: 100,
  },
  {
    id: '_c_6036fcaa5f8e67430d17ee2d',
    displayName: 'manasProfile1',
    fieldType: 'CUSTOM_FIELD',
    rangeFacet: false,
    priority: 2,
  },
  {
    id: '_c_6036fcaa5f8e67430d27ee2d',
    displayName: 'manasProfile2',
    fieldType: 'PARTNER_CUSTOM_FIELD',
    rangeFacet: false,
    priority: 3,
  },
] as FacetsMetadata;

describe('getAudienceProfileRequestDTOInput', () => {
  describe('getSelectedFilters', () => {
    test('should return empty `filters` when `selectedFacets` are empty', () => {
      const { filters } = getSelectedFilters(MOCK_FACET_FIELDS, {});

      expect(filters).toEqual({});
    });

    test('should return non-empty `filters` when `selectedFacets` user has applied channel `filters`', () => {
      const { filters } = getSelectedFilters(MOCK_FACET_FIELDS, {
        SN_TYPE: ['FACEBOOK'],
      });

      expect(filters).toEqual({
        SN_TYPE: ['FACEBOOK'],
      });
    });

    test('should return empty `clientCustomProperties` when `selectedFacets` are empty', () => {
      const { clientCustomProperties } = getSelectedFilters(MOCK_FACET_FIELDS, {});

      expect(clientCustomProperties).toEqual({});
    });

    test('should return non-empty `clientCustomProperties` when the user has applied `clientCustomProperties` facets', () => {
      const { clientCustomProperties } = getSelectedFilters(MOCK_FACET_FIELDS, {
        _c_6036fcaa5f8e67430d17ee2d: ['TEST'],
      });

      expect(clientCustomProperties).toEqual({
        _c_6036fcaa5f8e67430d17ee2d: ['TEST'],
      });
    });

    test('should return empty `partnerCustomProperties` when `selectedFacets` are empty', () => {
      const { partnerCustomProperties } = getSelectedFilters(MOCK_FACET_FIELDS, {});

      expect(partnerCustomProperties).toEqual({});
    });

    test('should return non-empty `partnerCustomProperties` when the user has applied `partnerCustomProperties` facets', () => {
      const { partnerCustomProperties } = getSelectedFilters(MOCK_FACET_FIELDS, {
        _c_6036fcaa5f8e67430d27ee2d: ['TEST'],
      });

      expect(partnerCustomProperties).toEqual({
        _c_6036fcaa5f8e67430d27ee2d: ['TEST'],
      });
    });
  });
});
