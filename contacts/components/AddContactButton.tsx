//libs
import { useCallback, memo } from 'react';
import { useApolloClient } from '@apollo/client';

//components
import Button from '@/components/button';

//hooks
import { useContactsTranslation } from '@/modules/contacts/i18n';
import { usePropertiesAppConfig } from '@/hooks/usePropertiesAppConfig';
import { useButton } from '@sprinklr/modules/platform/buttonActions';

//utils
import propertyConfigReader, { APP_CONFIG_PROPERTY_TYPES } from '@/utils/propertyAppConfig';

//constants
import { BUTTON_ACTIONS } from '@/modules/contacts/components/ButtonActionsProvider';
import { MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY } from '../myContacts/queries';

const AddContactButton = (): Spr.Null<JSX.Element> => {
  const { __contactsT } = useContactsTranslation();

  const { trigger } = useButton();
  const propertiesAppConfig = usePropertiesAppConfig();
  const apolloClient = useApolloClient();

  const isContactAdditionEnabled = propertyConfigReader.isPropertyEnabled(
    propertiesAppConfig,
    APP_CONFIG_PROPERTY_TYPES.ADD_CONTACTS
  );

  const openContactAdditionForm = useCallback(
    () =>
      trigger({
        templateId: BUTTON_ACTIONS.OPEN_CONTACT_ADDITION_FORM,
        id: 'OPEN_CONTACT_ADDITION_FORM',
        payload: {
          props: {
            onContactAddition: () =>
              setTimeout(() => {
                apolloClient.refetchQueries({
                  include: [MY_CONTACTS_PROFILES_QUERY, MY_CONTACTS_FACETS_QUERY],
                });
              }, 1000),
          },
        },
      }),
    [apolloClient, trigger]
  );

  return isContactAdditionEnabled ? (
    <Button onClick={openContactAdditionForm} data-testid="add-contact">
      {__contactsT('Add Contact')}
    </Button>
  ) : null;
};

const MemoizedAddContactButton = memo(AddContactButton);

export { MemoizedAddContactButton as AddContactButton };
