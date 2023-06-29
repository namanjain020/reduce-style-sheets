//libs
import dynamic from 'next/dynamic';

//components
import FilterPlaceholder from '@/components/placeholders/FilterPlaceholder';

export const FacetsPanel = dynamic(() => import(/* webpackChunkName: "filter-panel" */ './FacetsPanel'), {
  ssr: false,
  loading: FilterPlaceholder as () => null,
});
