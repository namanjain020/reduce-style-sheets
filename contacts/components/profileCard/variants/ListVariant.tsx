//libs
import { memo, ReactElement, useCallback, useState, SyntheticEvent } from 'react';
import _noop from 'lodash/noop';

//components
import { ProfileCardActions } from '../components/ProfileCardActions';
import { ProfileCardRightSection } from '../components/ProfileCardRightSection';
import { ProfileImage } from '../components/ProfileImage';
import { SocialProfileSwitcher } from '../components/socialProfileSwitcher';
import { ProfileCardLayout, SLOT_NAMES } from '../components/profileCardLayout';
import { Checkbox } from '@sprinklr/spaceweb/checkbox';

//hooks
import { useThirdPane } from '@/hooks/useThirdPane';
import { useProfileActions } from '../hooks/useProfileActions';
import { useProfileActionsHandler } from '../hooks/useProfileActionsHandler';
import { useHover } from '@sprinklr/modules/infra/hooks/useHover';
import { usePropertiesAppConfig } from '@/hooks/usePropertiesAppConfig';

//utils/entities
import { AudienceProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';
import propertyConfigReader, { APP_CONFIG_PROPERTY_TYPES } from '@/utils/propertyAppConfig';
import { splitProfileEntityId } from '@/modules/contacts/utils/splitProfileEntityId';
import { getSocialProfileEntityId } from '@sprinklr/modules/universalEntities/profile/helpers/general';

//constants
import messageActions from '@sprinklr/modules/infra/constants/messageActions';
import { ACTIONS as PROFILES_LIST_ACTIONS, OnAction } from '@/hooks/usePaginatedEntitySelection';
import { SEPARATOR } from '@/modules/contacts/utils/getSocialProfileEntityId';

//types
import { Profile, ContactsType } from '@/modules/contacts/types';
import { SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';

const CHECKBOX_POSITION = {
  TOP: 1,
  LEFT: 1,
};
const CHECKBOX_OVERRIDES = {
  Root: {
    props: {
      onClick: (event: SyntheticEvent): void => event.stopPropagation(),
    },
  },
};

export type Props = {
  profile: Profile;
  actionParams: { contactType: ContactsType };
} & Partial<{
  isSelected: boolean;
  onAction: OnAction<Profile>;
}>;

const ListVariant = ({ profile, actionParams, isSelected, onAction: onParentAction = _noop }: Props): ReactElement => {
  const { entityId } = useThirdPane();

  const { audienceProfileId: selectedProfileId } = splitProfileEntityId(entityId, SEPARATOR);

  const [hoverHandlers, isHovering] = useHover();

  const socialProfiles = AudienceProfileEntity.getSocialProfiles(profile);

  const [selectedSocialProfileIdx, setSelectedSocialProfileIdx] = useState<number>(0);

  const selectedSocialProfile =
    AudienceProfileEntity.getSocialProfiles(profile)?.[selectedSocialProfileIdx] ??
    AudienceProfileEntity.getSocialProfiles(profile)?.[0];

  const { actionItems, actionsLoading } = useProfileActions({
    profile,
    actionParams,
    socialProfile: selectedSocialProfile,
  });

  const { onAction } = useProfileActionsHandler({
    profile,
    macroActions: actionItems.macroActions,
    socialProfile: selectedSocialProfile,
    contactType: actionParams.contactType,
  });

  const handleProfileSwitch = useCallback(
    (nextSocialProfile: SocialProfile) =>
      setSelectedSocialProfileIdx(
        AudienceProfileEntity.getSocialProfiles(profile)?.findIndex(
          (socialProfile: SocialProfile) =>
            getSocialProfileEntityId(socialProfile) === getSocialProfileEntityId(nextSocialProfile)
        )
      ),
    [profile]
  );

  const profileId = AudienceProfileEntity.getId(profile);

  const openProfileDetailPane = useCallback(() => onAction({ action: messageActions.DETAILS }), [onAction]);

  const propertiesAppConfig = usePropertiesAppConfig();

  const isBulkActionsBarEnabled = propertyConfigReader.isPropertyEnabled(
    propertiesAppConfig,
    APP_CONFIG_PROPERTY_TYPES.ENABLE_BULK_ACTIONS_BAR
  );

  const handleChange = useCallback(
    () =>
      onParentAction({
        type: isSelected ? PROFILES_LIST_ACTIONS.UNSELECT_ENTITY : PROFILES_LIST_ACTIONS.SELECT_ENTITY,
        payload: {
          entity: profile,
        },
      }),
    [isSelected, onParentAction, profile]
  );

  const showCheckbox = isHovering || isSelected;

  return (
    <ProfileCardLayout
      containerClassName={[
        isSelected ? 'spr-interactive-focus' : '',
        ({ theme }) =>
          selectedProfileId === profileId
            ? {
                borderLeftColor: theme.spr.interactiveFocus,
              }
            : '',
      ]}
      onContainerClick={openProfileDetailPane}
      containerProps={hoverHandlers}
    >
      <ProfileCardLayout.Slot name={SLOT_NAMES.LEFT_SECTION}>
        {isBulkActionsBarEnabled ? (
          <Checkbox
            className={[
              'absolute z-10 focus-within:opacity-100',
              showCheckbox ? 'opacity-100' : 'opacity-0',
              {
                top: `${CHECKBOX_POSITION.TOP}rem`,
                left: `${CHECKBOX_POSITION.LEFT}rem`,
              },
            ]}
            checked={isSelected}
            onChange={handleChange}
            overrides={CHECKBOX_OVERRIDES}
          />
        ) : null}

        <ProfileImage socialProfile={selectedSocialProfile} />

        <SocialProfileSwitcher
          socialProfile={selectedSocialProfile}
          socialProfiles={socialProfiles}
          onProfileSwitch={handleProfileSwitch}
        />
      </ProfileCardLayout.Slot>

      <ProfileCardLayout.Slot name={SLOT_NAMES.RIGHT_SECTION}>
        <ProfileCardRightSection profile={profile} socialProfile={selectedSocialProfile} />

        <ProfileCardActions
          className="border-t-1 spr-border-01 w-full bottom-0 flex-none"
          actionItems={actionItems}
          onAction={onAction}
          loading={actionsLoading}
        />
      </ProfileCardLayout.Slot>
    </ProfileCardLayout>
  );
};

const MemoizedListVariant = memo(ListVariant);

export { MemoizedListVariant as ListVariant };
