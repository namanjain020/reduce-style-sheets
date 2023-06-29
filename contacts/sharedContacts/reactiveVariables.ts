//libs
import { makeVar } from '@apollo/client';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import { DEFAULT_SORT_DETAILS } from '../constants';

//types
import { SortDetails } from '@/components/filter/types';

export const selectedFacetsVar = makeVar<Spr.StringTMap<string[]>>(EMPTY_OBJECT_READONLY);
export const searchQueryVar = makeVar<string>('');
export const sortDetailsVar = makeVar<SortDetails>(DEFAULT_SORT_DETAILS);
