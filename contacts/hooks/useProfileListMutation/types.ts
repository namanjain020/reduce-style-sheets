//libs
import { ApolloError } from '@apollo/client';

//constants
import { PROFILE_LIST_MUTATION_ACTIONS } from './constants';
import { ENTITY_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';

//types
import { Action as BaseAction } from '@sprinklr/modules/infra/types';
import { AudienceProfileRequestDTOInput } from '@/modules/contacts/types';

export type OnProfileListMutation = (
  action:
    | BaseAction<
        PROFILE_LIST_MUTATION_ACTIONS.REMOVE,
        {
          selectionType: ENTITY_SELECTION_TYPE.ENTITIES;
          profileIds: Array<string>;
          onCompleted: () => void;
          onError: (err: ApolloError) => void;
        }
      >
    | BaseAction<
        PROFILE_LIST_MUTATION_ACTIONS.REMOVE,
        {
          selectionType: ENTITY_SELECTION_TYPE.ALL;
          searchQuery: string;
          selectedFacets: Spr.StringTMap<string[]>;
          profileIdsToExclude: Array<string>;
          onCompleted: () => void;
          onError: (err: ApolloError) => void;
        }
      >
    | BaseAction<
        PROFILE_LIST_MUTATION_ACTIONS.MERGE,
        {
          profileAttributes: Spr.StringStringMap;
          profileIds: Array<string>;
          onCompleted: () => void;
          onError: (err: ApolloError) => void;
        }
      >
    | BaseAction<
        PROFILE_LIST_MUTATION_ACTIONS.ADD_TO_PROFILE_LISTS,
        {
          selectionType: ENTITY_SELECTION_TYPE.ENTITIES;
          profileIds: Array<string>;
          contactListIds: Array<string>;
          onCompleted: () => void;
          onError: (err: ApolloError) => void;
        }
      >
    | BaseAction<
        PROFILE_LIST_MUTATION_ACTIONS.ADD_TO_PROFILE_LISTS,
        {
          selectionType: ENTITY_SELECTION_TYPE.ALL;
          searchQuery: string;
          selectedFacets: Spr.StringTMap<string[]>;
          profileIdsToExclude: Array<string>;
          contactListIds: Array<string>;
          onCompleted: () => void;
          onError: (err: ApolloError) => void;
        }
      >
) => void;

export enum ContactBulkActionType {
  ADD_TO_CONTACT_LISTS = 'ADD_TO_CONTACT_LISTS',
  DELETE = 'DELETE',
}

export type DistributedContactTaskConfig = {
  taskType: ContactBulkActionType;
  universalProfileIds?: Array<string>;
  audienceProfileRequestDTO?: AudienceProfileRequestDTOInput;
  contactListIds?: Array<string>;
};
