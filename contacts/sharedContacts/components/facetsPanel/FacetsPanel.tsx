//libs
import { memo, useMemo, useCallback } from 'react';
import { useReactiveVar } from '@apollo/client';

//components
import { FilterPanel } from '@/components/filter/components/filterPanel';

//hooks
import { useSharedContactsFacets } from '../../hooks/useSharedContactsFacets';

//constants
import { FILTER_STATUS } from '@/components/filter/constants';
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

//variables
import { selectedFacetsVar } from '@/modules/contacts/sharedContacts/reactiveVariables';

//utils
import { adaptFacets } from '@/modules/contacts/utils/adaptFacets';
import { removeEmpty } from '@/utils/general';

//types
import { Facet } from '@/modules/contacts/types';

const FacetsPanel = (): JSX.Element => {
  const { data, loading } = useSharedContactsFacets();
  const selectedFacets = useReactiveVar(selectedFacetsVar);

  const facets = data?.facets ?? (EMPTY_ARRAY_READONLY as Facet[]);
  const facetsStatus = loading ? FILTER_STATUS.PENDING : FILTER_STATUS.RESOLVED;

  const adaptedFacets = useMemo(() => removeEmpty(adaptFacets(facets), 'options'), [facets]);

  const handleFacetsChange = useCallback((values: any) => selectedFacetsVar(values), []);

  return (
    <FilterPanel
      onFilterChange={handleFacetsChange}
      filters={adaptedFacets}
      enableSave={false}
      values={selectedFacets}
      filterStatus={facetsStatus}
    />
  );
};

export default memo(FacetsPanel);
