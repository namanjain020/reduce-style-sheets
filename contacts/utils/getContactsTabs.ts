//libs
import _camelCase from 'lodash/camelCase';
import _identity from 'lodash/identity';

//utils
import propertyConfigReader, { APP_CONFIG_PROPERTY_TYPES } from '@/utils/propertyAppConfig';

//constants
import { getDefaultContactsTabs } from '../constants';

//types
import { ContactTabsFormValue } from '@space/enterprise/modules/governance/containers/appConfig/components/appProperties/config/components/contactTabsForm/types';
import { I18nextTFunction } from '@sprinklr/modules/sprI18Next';
import { PropertiesAppConfig } from '@/types/appConfig';

export const getContactsTabs = ({
  propertiesAppConfig,
}: {
  propertiesAppConfig: PropertiesAppConfig;
}): Array<{ id: string; url: string }> => {
  const contactTabsValueGetter = propertyConfigReader.propertyValueGetter<
    (fn: I18nextTFunction) => ContactTabsFormValue
  >(propertiesAppConfig, APP_CONFIG_PROPERTY_TYPES.CONTACTS_TABS);

  const tabs = contactTabsValueGetter(_identity)
    .filter(tab => !!tab.id && !!tab.label)
    .map(tab => ({
      id: tab.id,
      url: _camelCase(tab.label),
    }));

  return tabs.length ? tabs : getDefaultContactsTabs(_identity);
};
