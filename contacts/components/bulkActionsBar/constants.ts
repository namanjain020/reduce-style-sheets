//libs
import { ComponentType } from 'react';

//icons
import DeleteIcon from '@sprinklr/spaceweb-icons/solid/Delete';
import MergeIcon from '@sprinklr/spaceweb-icons/solid/Merge';
import ContactIcon from '@sprinklr/spaceweb-icons/solid/Contact';

export const ICON_MAP: Spr.StringTMap<ComponentType<React.PropsWithChildren<unknown>>> = {
  delete: DeleteIcon,
  merge: MergeIcon,
  contact: ContactIcon,
};

export enum BULK_ACTIONS {
  SELECT_ALL = 'SELECT_ALL',
  UNSELECT_ALL = 'UNSELECT_ALL',
  DELETE = 'DELETE',
  MERGE = 'MERGE',
  ADD_TO_PROFILE_LISTS = 'ADD_TO_PROFILE_LISTS',
}
