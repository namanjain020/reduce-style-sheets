//libs
import _isUndefined from 'lodash/isUndefined';
import { useState, useEffect } from 'react';
import { useSelector, DefaultRootState } from 'react-redux';

//helpers
import LiteExperienceReader from '@/experienceEngine/reader';
import getContactActions from '@/factory/actionsFactory/actions/contactActions';
import getActions from '@/factory/actionsFactory/actionsFactory';

//utils
import { getAccountsMap } from '@/reducers/settings/settings';

//hooks
import { useSprEnv } from '@/contexts/sprEnv/useSprEnv';
import { useMacroActions } from '@/modules/macros/hooks/useMacroActions';
import { useContactsWorkflowTranslation, ContactsWorkflowTranslationFn } from '@/modules/contacts/i18n';
import { useActionsModificationConfig } from '@/components/engagementEntity/hooks/useActionsModificationConfig';
import { useWorkflowTranslation, WorkflowTranslationFn } from '@sprinklr/modules/workflow/i18n';
import { useSprFeature } from '@space/core/contexts/sprEnv';
import useFetchPermissions from '@space/hooks/useFetchPermissions';
import { useFetchUpdateAllowedChannels } from '@/modules/contacts/hooks/useFetchUpdateAllowedChannels';

//constants
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';
import actionCategories from '@space/enterprise/modules/engagement/factory/messageActions/constants/actionCategories';
import { CHANNEL_TYPES } from '@sprinklr/modules/infra/constants/channelTypes';
import { AUDIENCE_PROFILE } from '@sprinklr/modules/infra/constants/assetClasses';

//types
import { Profile, ContactsType } from '@/modules/contacts/types';
import { ActionGetterParams } from '@/types/engagementEntity';
import { SprEnv } from '@/types/sprEnv';
import { Macros } from '@/types/macro';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { Account } from '@sprinklr/modules/universalEntities/account/types';
import type { IsOn } from '@space/core/contexts/sprEnv/feature';

type ActionItems = Omit<ActionGetterParams['actionItems'], 'actionConfigs'>;

const getActionItems = ({
  socialProfile,
  sprEnv,
  detailModeOn,
  actionsModificationConfig,
  macros,
  contactType,
  accountIdMap,
  __contactsWorkflowT,
  __workflowT,
  isOn,
  channelsAllowedToUpdate,
  profile,
}: {
  socialProfile: SocialProfile;
  sprEnv: SprEnv;
  actionsModificationConfig: Spr.Undefined<Spr.StringAnyMap>;
  macros: Macros;
  contactType: ContactsType;
  detailModeOn?: boolean;
  accountIdMap: Spr.StringTMap<Account>;
  __contactsWorkflowT: ContactsWorkflowTranslationFn;
  __workflowT: WorkflowTranslationFn;
  isOn: IsOn;
  channelsAllowedToUpdate: Spr.Undefined<Array<string>>;
  profile: Profile;
}): ActionItems => {
  const allowedMacroActions = LiteExperienceReader(sprEnv).getProfileActions();

  return getActions(getContactActions, {
    message: EMPTY_OBJECT_READONLY,
    params: {
      socialProfile,
      macros,
      allowedMacroActions,
      actionsModificationConfig,
      detailModeOn,
      contactType,
      accountIdMap,
      propertiesAppConfig: EMPTY_OBJECT_READONLY,
      __contactsWorkflowT,
      __workflowT,
      isOn,
      channelsAllowedToUpdate,
      profile,
    },
  });
};

type UseProfileActions = (props: {
  profile: Profile;
  detailModeOn?: boolean;
  actionParams: { contactType: ContactsType };
  socialProfile: SocialProfile;
}) => {
  actionItems: ActionItems;
  actionsLoading: boolean;
};

const useProfileActions: UseProfileActions = ({
  profile,
  actionParams: actionGetterParams,
  detailModeOn = false,
  socialProfile,
}) => {
  const { __contactsWorkflowT } = useContactsWorkflowTranslation();
  const { __workflowT } = useWorkflowTranslation();

  const { channelsAllowedToUpdate, loading: isFetchingUpdateAllowedChannels } = useFetchUpdateAllowedChannels();

  const sprEnv = useSprEnv();

  const { isOn } = useSprFeature();

  const [isFetchingPermissions] = useFetchPermissions(AUDIENCE_PROFILE);

  const macros = useMacroActions(CHANNEL_TYPES.PROFILE);
  const actionsModificationConfig = useActionsModificationConfig<Profile>(actionCategories.PROFILE, profile);

  const accountIdMap = useSelector<DefaultRootState, Spr.StringTMap<Account>>(getAccountsMap);

  const [actionItems, setActionItems] = useState<ActionItems>(EMPTY_OBJECT_READONLY as ActionItems);

  const actionsLoading = !_isUndefined(macros) || isFetchingPermissions || isFetchingUpdateAllowedChannels;

  useEffect(() => {
    if (macros) {
      setActionItems(
        getActionItems({
          socialProfile,
          sprEnv,
          actionsModificationConfig,
          macros,
          detailModeOn,
          accountIdMap,
          __contactsWorkflowT,
          __workflowT,
          isOn,
          channelsAllowedToUpdate,
          profile,
          ...actionGetterParams,
        })
      );
    }
  }, [
    detailModeOn,
    profile,
    socialProfile,
    macros,
    actionsModificationConfig,
    sprEnv,
    actionGetterParams,
    accountIdMap,
    __contactsWorkflowT,
    __workflowT,
    isOn,
    channelsAllowedToUpdate,
  ]);

  return {
    actionItems,
    actionsLoading,
  };
};

export { useProfileActions };
