/*
 * Created on: Thu Jul 08 2021 9:19:09 PM
 * Author: Apar Garg
 */

//libs
import { Dispatch, AnyAction } from 'redux';

//helpers/utils
import { showNotification } from '@/modules/common/actions';
import macroReader from '@space/core/entityReaders/Macro';
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/AudienceProfileEntity';
import { getSocialProfileEntityId } from '@/modules/contacts/utils/getSocialProfileEntityId';
import { getEmailSocialProfile } from '@space/enterprise/modules/influencers/actions/sendMessageActionHandlers';
import { ACTIONS, handlersMap as macroActionHandlersMap } from '@/components/macroActionsMenu/actionHandlers';
import { SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities/SocialProfileEntity';

//constants
import ASSET_CLASSES from '@sprinklr/modules/infra/constants/assetClasses';
import messageActions from '@sprinklr/modules/infra/constants/messageActions';
import moduleTypes from '@/constants/moduleTypes';
import { BUTTON_ACTIONS } from '@/contexts/buttonActions/actionTemplates';
import { PUBLISHER_TYPES } from '@/modules/publisher/constants/publisherTypeConstants';
import { UPDATE_TYPE_CODE } from '@sprinklr/modules/infra/constants/messageTypes';
import { ENTITY_BUTTON_ACTIONS } from '@/contexts/entityButtonActions/actionTemplates';

//types
import type { Macro } from '@space/modules/macro/types';
import type { Profile } from '@/modules/contacts/types';

//service
import { applyMacro as applyMacroService } from '@space/core/services/macroService';

//types
import { MacroTranslationFn } from '@sprinklr/modules/macro/i18n';

export const MACRO = 'MACRO';
export const MANUAL_MACRO = 'MANUAL_MACRO';
export const HIDE_MODAL = 'HIDE_MODAL';

const applyMacroAction = ({
  macro,
  searchedKeyword,
  manualActionDataByMacroId,
  dispatch,
  __macroT,
  fetchAudienceProfile,
  profile,
}: {
  macro: Macro & {
    additional: Spr.StringAnyMap;
    requiresConfirmation?: Spr.StringAnyMap;
    key: string;
    properties: {
      buttonName: string;
    };
  };
  searchedKeyword: string;
  manualActionDataByMacroId?: Spr.StringAnyMap;
  dispatch: Dispatch<AnyAction>;
  __macroT: MacroTranslationFn;
  fetchAudienceProfile: (entityId: string) => void;
  profile: Profile;
}): Promise<void> => {
  const macroName = macro.properties?.buttonName ?? macroReader.name(macro);
  const macroId = macro.key || macroReader.id(macro);

  return applyMacroService({
    assetClass: ASSET_CLASSES.PROFILE,
    entityKeys: [searchedKeyword],
    macroIds: [macroId],
    manualActionDataByMacroId,
  })
    .then(() => {
      dispatch(
        showNotification({
          message: __macroT('I have applied macro {{macroName}}.', { macroName }),
          type: 'success',
        })
      );

      fetchAudienceProfile(AudienceProfileEntity.getId(profile));
    })
    .catch(() => {
      dispatch(
        showNotification({
          message: __macroT("I couldn't apply the macro {{macroName}}.", { macroName }),
          type: 'error',
        })
      );
    });
};

export const actionHandlers = {
  [MACRO]: async (
    { payload },
    { params: { profile, dispatch, trigger, macroActions, onError, __macroT, fetchAudienceProfile } }
  ) => {
    const { actionTypeParams } = payload;
    const action = macroActions[0];

    macroActionHandlersMap[ACTIONS.MACRO](
      {
        payload: {
          action,
        },
      },
      {
        params: {
          trigger,
          target: actionTypeParams.target,
          __macroT,
          applyMacro: ({ macroAction, onHide, manualActionDataByMacroId }) =>
            applyMacroAction({
              searchedKeyword: AudienceProfileEntity.getId(profile),
              manualActionDataByMacroId,
              dispatch,
              macro: macroAction,
              __macroT,
              fetchAudienceProfile,
              profile,
            }).then(() => onHide()),
          onError,
          assetClass: ASSET_CLASSES.PROFILE,
        },
      }
    );
  },

  [messageActions.SHOW_MACRO_BOX]: async (
    { payload },
    { params: { dispatch, macroActions, trigger, profile, __macroT, fetchAudienceProfile } }
  ) => {
    const { actionTypeParams } = payload;

    trigger({
      templateId: ENTITY_BUTTON_ACTIONS.OPEN_MACRO_ACTIONS_MENU,
      id: 'OPEN_MACRO_ACTIONS_MENU',
      payload: {
        actions: macroActions,
        target: actionTypeParams.target,
        applyMacro: ({ macroAction, onHide, manualActionDataByMacroId }) =>
          applyMacroAction({
            searchedKeyword: AudienceProfileEntity.getId(profile),
            manualActionDataByMacroId,
            dispatch,
            macro: macroAction,
            __macroT,
            fetchAudienceProfile,
            profile,
          }).then(() => onHide()),
        assetClass: ASSET_CLASSES.PROFILE,
      },
    });
  },

  [messageActions.DELETE]: (
    { payload },
    {
      params: {
        cache,
        closeThirdPane,
        profile,
        socialProfile,
        __contactsT,
        trigger,
        __commonT,
        deleteContact,
        onError,
        onSuccess,
        tabsMap,
        contactType,
      },
    }
  ) => {
    const tabLabel = tabsMap[contactType]?.label ?? __contactsT('contacts');
    const profileId = AudienceProfileEntity.getId(profile);
    const profileName = SocialProfileEntity.getName(socialProfile);
    const socialProfileId = getSocialProfileEntityId(profile, socialProfile);

    trigger({
      templateId: BUTTON_ACTIONS.OPEN_CONFIRMATION_MODAL,
      id: 'OPEN_CONFIRMATION_MODAL',
      payload: {
        confirmationBtnLabel: __commonT('Remove'),
        headerLabel: __contactsT('Remove Contact'),
        confirmationMessage: __contactsT('You are about to remove this contact. Are you sure you want to proceed?'),
        onConfirmation: onHide =>
          deleteContact({
            variables: { universalProfileIds: [profileId] },
          })
            .then(() => {
              onSuccess({
                message: __contactsT('I have removed {{profileName}} from your {{tabLabel}}.', {
                  profileName,
                  tabLabel,
                }),
              });

              closeThirdPane(socialProfileId);
              onHide();

              const cacheId = cache.identify({
                id: profileId,
                __typename: 'AudienceProfile',
              });

              cache.evict({ id: cacheId });
              cache.gc();
            })
            .catch(() =>
              onError({
                message: __contactsT("I couldn't remove {{profileName}} from your {{tabLabel}}.", {
                  profileName,
                  tabLabel,
                }),
              })
            ),
      },
    });
  },

  [messageActions.DETAILS]: ({ payload }, { params: { profile, socialProfile, openThirdPane } }) =>
    openThirdPane(moduleTypes.PROFILE, getSocialProfileEntityId(profile, socialProfile)),

  [messageActions.REPLY]: (
    {
      payload: {
        actionTypeParams: { target },
      },
    },
    { params: { trigger, profile, socialProfile } }
  ) => {
    trigger({
      templateId: BUTTON_ACTIONS.OPEN_PUBLISHER,
      id: 'OPEN_PROFILE_ENGAGE_REPLY_BOX',
      payload: {
        props: {
          key: AudienceProfileEntity.getId(profile),
          socialProfile,
          target,
        },
        type: PUBLISHER_TYPES.PROFILE_ENGAGE_REPLY_BOX,
      },
    });
  },

  [messageActions.EMAIL_CLIENT]: ({ payload }, { params: { trigger, profile } }) => {
    trigger({
      templateId: BUTTON_ACTIONS.OPEN_PUBLISHER,
      id: 'OPEN_SOCIAL_ENGAGEMENT_PUBLISHER',
      payload: {
        props: {
          socialProfilesToEngage: [getEmailSocialProfile(profile)],
          messageType: UPDATE_TYPE_CODE,
        },
        type: PUBLISHER_TYPES.SOCIAL_PROFILE_ENGAGEMENT_PUBLISHER,
      },
    });
  },

  [messageActions.EDIT_PROFILE]: ({ payload }, { params: { trigger, profile } }) => {
    trigger({
      templateId: ENTITY_BUTTON_ACTIONS.OPEN_PROFILE_EDITOR,
      id: 'OPEN_PROFILE_EDITOR',
      payload: {
        profile,
      },
    });
  },
} as const;

export { applyMacroAction as __testApplyMacroAction };
