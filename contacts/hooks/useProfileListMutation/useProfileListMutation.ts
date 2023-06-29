//libs
import { useCallback } from 'react';
import { gql, useApolloClient } from '@apollo/client';

//hooks
import { useFacetsMetadata } from '@/modules/contacts/hooks/useFacetsMetadata';

//utils
import { getAudienceProfileRequestDTOInput } from '@/modules/contacts/utils/getAudienceProfileRequestDTOInput';

//types
import { ENTITY_SELECTION_TYPE as PROFILE_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';
import { ContactBulkActionType, DistributedContactTaskConfig, OnProfileListMutation } from './types';
import { ProfileCreationRequest } from '../../components/addContacts/hooks/useCreateContact/types';
import { ContactsType } from '@/modules/contacts/types';

//constants
import { PROFILE_LIST_MUTATION_ACTIONS } from './constants';
import { CREATE_CONTACT_MUTATION } from '../../components/addContacts/hooks/useCreateContact/mutations';
import { MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY } from '@/modules/contacts/myContacts/queries';
import {
  SHARED_CONTACTS_PROFILES_QUERY,
  SHARED_CONTACTS_FACETS_QUERY,
} from '@/modules/contacts/sharedContacts/queries';
import { CONTACTS_TYPES } from '@/modules/contacts/constants';

const APPLY_CONTACT_BULK_ACTION_MUTATION = gql`
  mutation applyDstContactBulkAction($distributedContactTaskConfig: DistributedContactTaskConfigInput!) {
    applyDstContactBulkAction(distributedContactTaskConfig: $distributedContactTaskConfig)
  }
`;

const APPLY_CONTACT_BULK_ACTION_ASYNC_MUTATION = gql`
  mutation applyDstContactBulkActionAsync($distributedContactTaskConfig: DistributedContactTaskConfigInput!) {
    applyDstContactBulkActionAsync(distributedContactTaskConfig: $distributedContactTaskConfig)
  }
`;

const useProfileListMutation = ({ selectedTab }: { selectedTab: ContactsType }): OnProfileListMutation => {
  const { data: facetsMetadata } = useFacetsMetadata();

  const apolloClient = useApolloClient();

  const onProfileListMutation = useCallback<OnProfileListMutation>(
    action => {
      switch (action.type) {
        case PROFILE_LIST_MUTATION_ACTIONS.REMOVE: {
          if (action.payload.selectionType === PROFILE_SELECTION_TYPE.ALL) {
            const { profileIdsToExclude, searchQuery, selectedFacets, onCompleted, onError } = action.payload;

            return apolloClient
              .mutate<boolean, { distributedContactTaskConfig: DistributedContactTaskConfig }>({
                mutation: APPLY_CONTACT_BULK_ACTION_ASYNC_MUTATION,
                variables: {
                  distributedContactTaskConfig: {
                    taskType: ContactBulkActionType.DELETE,
                    audienceProfileRequestDTO: getAudienceProfileRequestDTOInput({
                      searchQuery,
                      selectedFacets,
                      facetsMetadata: facetsMetadata!,
                      excludeFilters: {
                        ID: profileIdsToExclude,
                      },
                    }),
                  },
                },
              })
              .then(onCompleted)
              .catch(onError);
          }

          const { profileIds, onCompleted, onError } = action.payload;

          return apolloClient
            .mutate<boolean, { distributedContactTaskConfig: DistributedContactTaskConfig }>({
              mutation: APPLY_CONTACT_BULK_ACTION_MUTATION,
              variables: {
                distributedContactTaskConfig: {
                  taskType: ContactBulkActionType.DELETE,
                  universalProfileIds: profileIds,
                },
              },
              refetchQueries:
                selectedTab === CONTACTS_TYPES.MY_CONTACTS
                  ? [MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY]
                  : [SHARED_CONTACTS_PROFILES_QUERY, SHARED_CONTACTS_FACETS_QUERY],
            })
            .then(onCompleted)
            .catch(onError);
        }

        case PROFILE_LIST_MUTATION_ACTIONS.MERGE: {
          const { profileAttributes, profileIds, onCompleted, onError } = action.payload;

          return apolloClient
            .mutate<
              Spr.StringAnyMap,
              {
                addToContacts: boolean;
                profileCreationRequest: ProfileCreationRequest;
              }
            >({
              mutation: CREATE_CONTACT_MUTATION,
              variables: {
                addToContacts: true,
                profileCreationRequest: {
                  profileAttributes,
                  profileIdsToMerge: profileIds,
                },
              },
              refetchQueries:
                selectedTab === CONTACTS_TYPES.MY_CONTACTS
                  ? [MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY]
                  : [SHARED_CONTACTS_PROFILES_QUERY, SHARED_CONTACTS_FACETS_QUERY],
            })
            .then(onCompleted)
            .catch(onError);
        }

        case PROFILE_LIST_MUTATION_ACTIONS.ADD_TO_PROFILE_LISTS: {
          if (action.payload.selectionType === PROFILE_SELECTION_TYPE.ALL) {
            const { profileIdsToExclude, searchQuery, selectedFacets, contactListIds, onCompleted, onError } =
              action.payload;

            return apolloClient
              .mutate<boolean, { distributedContactTaskConfig: DistributedContactTaskConfig }>({
                mutation: APPLY_CONTACT_BULK_ACTION_ASYNC_MUTATION,
                variables: {
                  distributedContactTaskConfig: {
                    taskType: ContactBulkActionType.ADD_TO_CONTACT_LISTS,
                    contactListIds,
                    audienceProfileRequestDTO: getAudienceProfileRequestDTOInput({
                      searchQuery,
                      selectedFacets,
                      facetsMetadata: facetsMetadata!,
                      excludeFilters: {
                        ID: profileIdsToExclude,
                      },
                    }),
                  },
                },
              })
              .then(onCompleted)
              .catch(onError);
          }

          const { profileIds, contactListIds, onCompleted, onError } = action.payload;

          return apolloClient
            .mutate<boolean, { distributedContactTaskConfig: DistributedContactTaskConfig }>({
              mutation: APPLY_CONTACT_BULK_ACTION_MUTATION,
              variables: {
                distributedContactTaskConfig: {
                  taskType: ContactBulkActionType.ADD_TO_CONTACT_LISTS,
                  universalProfileIds: profileIds,
                  contactListIds,
                },
              },
            })
            .then(onCompleted)
            .catch(onError);
        }

        default:
          return undefined;
      }
    },
    [apolloClient, selectedTab, facetsMetadata]
  );

  return onProfileListMutation;
};

export { useProfileListMutation };
