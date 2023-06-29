//types
import { Facet } from '@/modules/contacts/types';
import { Filter } from '@/components/filter/types';

export const adaptFacets = (facets: Array<Facet>): Array<Filter> =>
  facets.map(({ facetField, options }) => ({
    ...facetField,
    localizationKey: '',
    lookupSupported: false,
    searchSupported: false,
    options: options.map(option => ({
      ...option,
      values: [option.value],
      localizationKey: '',
    })),
  }));
