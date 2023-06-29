//libs
import _isEmpty from 'lodash/isEmpty';

//types
import { FacetsMetadata } from '@/modules/contacts/types';

export const getEnabledFacetFields = (facetFields: FacetsMetadata, enabledFacetFieldIds: string[]): FacetsMetadata =>
  _isEmpty(enabledFacetFieldIds)
    ? facetFields
    : facetFields.filter(facetField => enabledFacetFieldIds.includes(facetField.id));
