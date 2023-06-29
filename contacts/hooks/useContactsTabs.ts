/* Created by Gaurav on 15/03/22 */

//libs
import { useMemo, useCallback, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import _camelCase from 'lodash/camelCase';

//hooks
import { usePropertiesAppConfig } from '@/hooks/usePropertiesAppConfig';
import { useAppConfigTranslation } from '@space/i18n/namespaces/appConfig';
import { useContactsTranslation } from '@/modules/contacts/i18n';

//utils
import propertyConfigReader, { APP_CONFIG_PROPERTY_TYPES } from '@/utils/propertyAppConfig';
import { getContactsPath } from '@/modules/route/route';

//types
import type { ContactTabsFormValue } from '@space/enterprise/modules/governance/containers/appConfig/components/appProperties/config/components/contactTabsForm/types';
import type { I18nextTFunction } from '@sprinklr/modules/sprI18Next';
import type { TabsMap } from '../types';

//constants
import { getDefaultContactsTabs } from '../constants';

const useContactsTabs = (): {
  tabsMap: TabsMap;
  handleTabSwitch: (event: SyntheticEvent<HTMLElement>) => void;
} => {
  const propertiesAppConfig = usePropertiesAppConfig();
  const {
    push,
    query: { menuId, subMenuId },
  } = useRouter();

  const { __contactsT } = useContactsTranslation();
  const { __appConfigT } = useAppConfigTranslation();

  const contactTabsValueGetter = useMemo(
    () =>
      propertyConfigReader.propertyValueGetter<(__appConfigT: I18nextTFunction) => ContactTabsFormValue>(
        propertiesAppConfig,
        APP_CONFIG_PROPERTY_TYPES.CONTACTS_TABS
      ),
    [propertiesAppConfig]
  );

  const tabsMap = useMemo(() => {
    const tabs = contactTabsValueGetter(__appConfigT).filter(tab => !!tab.id);

    return (tabs.length ? tabs : getDefaultContactsTabs(__contactsT)).reduce(
      (acc, { label, id, url }) => ({ ...acc, [id]: { label, ariaLabel: label, id: url ?? _camelCase(label) } }),
      {}
    );
  }, [__appConfigT, __contactsT, contactTabsValueGetter]);

  const handleTabSwitch = useCallback(
    (event: SyntheticEvent<HTMLElement>) =>
      event.currentTarget.dataset.id
        ? push(
            getContactsPath({
              menuId: menuId as string,
              subMenuId: subMenuId as string,
              contactTabId: event.currentTarget.dataset.id as string,
            })
          )
        : null,
    [menuId, push, subMenuId]
  );

  return { tabsMap, handleTabSwitch };
};

export { useContactsTabs };
