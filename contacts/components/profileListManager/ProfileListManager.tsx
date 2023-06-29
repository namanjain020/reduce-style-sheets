/**
 * Created by: Raj Meghpara
 * Date: 2022-01-07
 * Time: 16:45
 */

//libs
import { memo, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

// components
import { User } from '@space/modules/customEntity/tableCellRenderers/User';
import ProfileListActionHandler from './ProfileListActionHandler';
import StandardEntityRecordManager, { BackButton } from '@/components/standardEntityRecordManager';
import { Box } from '@sprinklr/spaceweb/box';

// constants
import { PROFILE_LIST } from '@sprinklr/modules/infra/constants/assetClasses';
import { MODULE_CONFIG } from '@space/enterprise/modules/governance/constants/governanceConstants';

//utils
import { connectContextualNotification } from '@space/containers/contextualNotification';

// helpers
import { getEntityWrapper } from '@space/modules/profileList/entityWrapper';
import { getPermissions } from '@space/enterprise/pages/governance/profileList/manager/helpers';

// hooks
import { useIsProfileListManagerEnabled } from '@/modules/contacts/hooks/useIsProfileListManagerEnabled';
import { gql, useApolloClient } from '@apollo/client';
import { useStyle } from '@sprinklr/spaceweb/style';
import { useSprEnv } from '@/contexts/sprEnv/useSprEnv';
import {
  useFetchProfileListsQuery,
  DEFAULT_PAGE_SIZE,
} from '@space/enterprise/pages/governance/profileList/manager/hooks/useFetchProfileListsQuery';
import { useRecordManagerActions } from '@sprinklr/modules/recordManager/legacy/hooks/useRecordManagerActions';
import { useRecordManagerLocalStorage } from '@sprinklr/modules/recordManager/legacy/hooks/useRecordManagerLocalStorage';
import { useStandardRecordManagerQuery } from '@sprinklr/modules/recordManager/standardEntity/hooks/useStandardRecordManagerQuery';
import { useProfileListTranslation } from '@sprinklr/modules/profileList/i18n';

// types
import { Config } from '@sprinklr/modules/recordManager/legacy/types';
import { ProfileList } from '@space/modules/profileList/types';

//constants
import AppVariables from '../../../src/assets/appVariables.scss';

const PROFILE_LIST_FRAGMENT = gql`
  fragment ProfileList on ProfileList {
    id
    name
    description
    ownerId
    clientId
    createdTime
    createdTimeMillis
    deleted
    lastModifiedUserId
    modifiedTimeMillis
    profileListOwnerUser {
      id
      userId
      fullName
      profileImageUrl
      visibleId
      userType
    }
    properties
    additional
  }
`;

const getOverrides = (onHide: () => void) => ({
  Header: {
    props: {
      shouldShowFilterBar: false,
      overrides: {
        Title: () => <BackButton onBack={onHide} />,
      },
    },
  },
});

const FLAVOUR = 'DST_WORKSPACE';
const FRAGMENT_NAME = 'ProfileList';

const ProfileListManager = (): Spr.Null<JSX.Element> => {
  const profileListManagerEnabled = useIsProfileListManagerEnabled();
  const {
    back,
    push,
    query: { menuId, subMenuId },
  } = useRouter();
  const apolloClient = useApolloClient();
  const { css } = useStyle();
  const { userId } = useSprEnv();

  const width = css({ width: AppVariables.workspaceWidth });

  const { __profileListT } = useProfileListTranslation();
  const profileListEntityWrapper = useMemo(() => getEntityWrapper(__profileListT), [__profileListT]);
  const { entityFieldNamesMap } = profileListEntityWrapper;

  const moduleConfig = MODULE_CONFIG.CLIENT_PROFILE_LISTS;
  const { entityLabels, isPartnerTypeModule } = moduleConfig;

  const { data: recordManagerPage } = useStandardRecordManagerQuery({
    entityType: `_s_${PROFILE_LIST}`,
    flavour: FLAVOUR,
  });

  const recordManagerId = recordManagerPage?.id;
  const localStorageKey = recordManagerId ? `recordManagerWorkSpace-${recordManagerId}` : undefined;
  const { localStorageOnAction, localStorageState } = useRecordManagerLocalStorage(localStorageKey);

  const onAction = useRecordManagerActions({
    recordManagerPage,
    onAction: localStorageOnAction,
    recordManagerState: localStorageState,
  });

  const queryResult = useFetchProfileListsQuery({
    recordManagerPage,
    requestState: localStorageState?.requestState,
    variablesInput: {
      client: !isPartnerTypeModule,
    },
  });

  const recordManagerOverrides = useMemo(() => getOverrides(back), [back]);

  const entityWrapper = useMemo(
    () => ({
      ...profileListEntityWrapper,
      getRecordManagerButtonAdditionalProps: (button, { record: entity }) => ({
        enabled: entity && entity.ownerId === userId,
      }),
    }),
    [profileListEntityWrapper, userId]
  );

  const config = useMemo(
    () =>
      ({
        entityLabels,
        pageSize: DEFAULT_PAGE_SIZE,
        entityWrapper,
        permissions: getPermissions(),
        ActionHandler: props => <ProfileListActionHandler {...props} moduleConfig={moduleConfig} />,
        fieldNameToCellRendererMap: {
          [entityFieldNamesMap.OWNER]: User,
        },
      } as Config<ProfileList>),
    [entityWrapper, entityFieldNamesMap, entityLabels, moduleConfig]
  );

  const getRecordById = useCallback(
    (recordId: any) =>
      apolloClient.readFragment({
        fragment: PROFILE_LIST_FRAGMENT,
        fragmentName: FRAGMENT_NAME,
        id: apolloClient.cache.identify({
          id: Number(recordId),
          __typename: FRAGMENT_NAME,
        }),
      }),
    [apolloClient]
  );

  if (!profileListManagerEnabled) {
    push(`/${menuId}/${subMenuId}/contacts`);

    return null;
  }

  return (
    <Box className={['h-screen', { width }]}>
      <StandardEntityRecordManager<ProfileList>
        recordManagerPage={recordManagerPage}
        config={config}
        queryResult={queryResult}
        recordManagerState={localStorageState}
        onAction={onAction}
        overrides={recordManagerOverrides}
        getRecordById={getRecordById}
      />
    </Box>
  );
};

export default connectContextualNotification()(memo(ProfileListManager));
