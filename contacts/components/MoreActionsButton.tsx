/* Created by Gaurav on 21/07/21 */

//lib
import { useCallback, memo, useMemo } from 'react';
import { useRouter } from 'next/router';

//components
import { StatefulPopover } from '@sprinklr/spaceweb/popover';
import { Box } from '@sprinklr/spaceweb/box';
import { Menu, MenuItem } from '@sprinklr/spaceweb/menu';
import { IconButton } from '@sprinklr/spaceweb/button';

//icons
import OptionsIcon from '@sprinklr/spaceweb-icons/solid/Options';
import ContentIcon from '@sprinklr/spaceweb-icons/solid/Content';
import BulletListIcon from '@sprinklr/spaceweb-icons/line/BulletList';
import ImportIcon from '@sprinklr/spaceweb-icons/solid/Import';
import ExportIcon from '@sprinklr/spaceweb-icons/solid/Export';

//hooks
import { useSprFeature } from '@space/core/contexts/sprEnv/useSprFeature';
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { useIsProfileListManagerEnabled } from '@/modules/contacts/hooks/useIsProfileListManagerEnabled';
import { useButton } from '@sprinklr/modules/platform/buttonActions';

//utils
import { getEnabledItems } from '@sprinklr/modules/infra/utils/getEnabledItems';

//constants
import { CONSENT_FORMS_ENABLED } from '@/constants/dynamicProperties';
import { BUTTON_ACTIONS } from './ButtonActionsProvider';

//types
import { IconProps } from '@sprinklr/spaceweb-icons/types';

type Action = {
  type: string;
  enabled: boolean;
  onClick: () => void;
  label: string;
  icon: React.ComponentType<React.PropsWithChildren<IconProps>>;
  dataTestId: string;
};

const MoreActionsButton = (): Spr.Null<JSX.Element> => {
  const {
    push,
    query: { menuId, subMenuId },
  } = useRouter();
  const { isOn } = useSprFeature();
  const { trigger } = useButton();
  const profileListManagerEnabled = useIsProfileListManagerEnabled();
  const { __contactsT } = useContactsTranslation();

  const consentFormEnabled = isOn(CONSENT_FORMS_ENABLED, 'D');
  const importContactsEnabled = isOn('DST_PROFILE_IMPORT_V2_ENABLED', 'D');
  const exportContactsEnabled = isOn('DST_PROFILE_EXPORT_ENABLED', 'D');

  const openConsentForm = useCallback(
    () => push(`/${menuId}/${subMenuId}/contacts/consentForm`),
    [menuId, push, subMenuId]
  );

  const openProfileListManager = useCallback(
    () => push(`/${menuId}/${subMenuId}/contacts/manager`),
    [menuId, push, subMenuId]
  );

  const openImportProfilesModal = useCallback(
    () =>
      trigger({
        templateId: BUTTON_ACTIONS.OPEN_IMPORT_PROFILES_MODAL,
        id: 'OPEN_CONFIRMATION_MODAL',
        payload: {},
      }),
    [trigger]
  );

  const openExportContactsModal = useCallback(
    () =>
      trigger({
        templateId: BUTTON_ACTIONS.OPEN_EXPORT_CONTACTS_MODAL,
        id: 'OPEN_EXPORT_CONTACTS_MODAL',
        payload: {},
      }),
    [trigger]
  );

  const actions = useMemo(
    () => [
      {
        type: 'EXPORT_CONTACTS',
        enabled: exportContactsEnabled,
        onClick: openExportContactsModal,
        label: __contactsT('Export'),
        icon: ExportIcon,
        dataTestId: 'export-contacts-button',
      },
      {
        type: 'CONSENT_FORM',
        enabled: consentFormEnabled,
        onClick: openConsentForm,
        label: __contactsT('Consent Form'),
        icon: ContentIcon,
        dataTestId: 'consent-form-button',
      },
      {
        type: 'PROFILE_LIST_MANAGER',
        enabled: profileListManagerEnabled,
        onClick: openProfileListManager,
        label: __contactsT('Contact List Manager'),
        icon: BulletListIcon,
        dataTestId: 'profile-list-manager-button',
      },
      {
        type: 'IMPORT_PROFILES',
        enabled: importContactsEnabled,
        onClick: openImportProfilesModal,
        label: __contactsT('Import Contacts'),
        icon: ImportIcon,
        dataTestId: 'import-profiles-button',
      },
    ],
    [
      exportContactsEnabled,
      openExportContactsModal,
      __contactsT,
      consentFormEnabled,
      openConsentForm,
      importContactsEnabled,
      profileListManagerEnabled,
      openProfileListManager,
      openImportProfilesModal,
    ]
  );

  const actionsToShow: Array<Action> = getEnabledItems(actions);

  if (actionsToShow.length === 0) return null;

  return (
    <StatefulPopover
      content={({ close }) => (
        <Menu onKeyDown={e => e.key === 'Tab' && close()}>
          {actionsToShow.map(({ icon: IconComponent, label, onClick, type, dataTestId }) => (
            <MenuItem key={type}>
              <Box className="flex flex-row items-center">
                <IconComponent className="mr-3 flex-none" />
                <Box
                  className="flex-1"
                  onClick={() => {
                    onClick();
                    close();
                  }}
                  data-testid={dataTestId}
                >
                  {label}
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    >
      {({ isOpen }) => (
        <IconButton
          className="spr-ui-01"
          isSelected={isOpen}
          shape="square"
          size="sm"
          aria-label={__contactsT('More Actions')}
          tooltipContent={__contactsT('More Actions')}
          data-testid="more-button"
        >
          <OptionsIcon />
        </IconButton>
      )}
    </StatefulPopover>
  );
};

export default memo(MoreActionsButton);
