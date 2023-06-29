//libs
import _reduce from 'lodash/reduce';
import _isUndefined from 'lodash/isUndefined';
import update from 'immutability-helper';

//constants
import { DEFAULT_SORT_DETAILS, FACET_TYPE_VS_PAYLOAD_KEY } from '../constants';

//utils
import { insertIf } from '@sprinklr/modules/infra/utils/object';

//types
import { FacetsMetadata, SelectedFilters, AudienceProfileRequestDTOInput } from '@/modules/contacts/types';

const PAGE_SIZE = 20;

const getSelectedFilters = (
  facetsMetaData: FacetsMetadata,
  selectedFacets: Spr.StringTMap<string[]>
): SelectedFilters => {
  const facetsMap = facetsMetaData.reduce((acc, facet) => ({ ...acc, [facet.id]: facet }), {});

  return _reduce<Spr.StringTMap<string[]>, SelectedFilters>(
    selectedFacets,
    (acc, selectedFacetValue, selectedFacetKey) => {
      const selectedFacet = facetsMap[selectedFacetKey];
      const payloadKey = FACET_TYPE_VS_PAYLOAD_KEY[selectedFacet.fieldType];

      if (!payloadKey) {
        return acc;
      }

      return update(acc, {
        [payloadKey]: {
          $merge: { [selectedFacet.id]: selectedFacetValue },
        },
      });
    },
    {
      filters: {},
      clientCustomProperties: {},
      partnerCustomProperties: {},
    }
  );
};

export const getAudienceProfileRequestDTOInput = ({
  facetsMetadata,
  selectedFacets,
  searchQuery,
  start,
  sortKey = DEFAULT_SORT_DETAILS.sortKey,
  sortOrder = DEFAULT_SORT_DETAILS.sortOrder,
  rows = PAGE_SIZE,
  excludeFilters,
}: {
  facetsMetadata: FacetsMetadata;
  selectedFacets: Spr.StringTMap<string[]>;
  searchQuery: string;
} & Partial<{
  excludeFilters: AudienceProfileRequestDTOInput['excludeFilters'];
  start: number;
  sortKey: string;
  sortOrder: string;
  rows: number;
}>): AudienceProfileRequestDTOInput => ({
  ...insertIf(!_isUndefined(start), {
    start,
    rows,
  }),
  ...insertIf(!!excludeFilters, {
    excludeFilters,
  }),
  sortInfo: { [sortKey]: sortOrder },
  excludeFacetFields: true,
  query: searchQuery,
  facetFields: facetsMetadata,
  ...getSelectedFilters(facetsMetadata, selectedFacets),
});

export { getSelectedFilters as __testGetSelectedFilters };
