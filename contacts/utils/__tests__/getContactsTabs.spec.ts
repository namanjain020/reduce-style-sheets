//utils
import { getContactsTabs } from '../getContactsTabs';

//types
import { PropertiesAppConfig } from '@/types/appConfig';

describe('getContactsTabs', () => {
  test('should filter out the tabs not containing id or label', () => {
    expect(
      getContactsTabs({
        propertiesAppConfig: {
          CONTACTS_TABS: [
            {
              id: 'myContacts',
              label: 'My Contacts',
            },
            {
              id: 'sharedContacts',
            },
            {
              label: 'Shared Contacts',
            },
          ],
        } as unknown as PropertiesAppConfig,
      })
    ).toEqual([
      {
        id: 'myContacts',
        url: 'myContacts',
      },
    ]);
  });

  test('should return the default tabs when CONTACTS_TABS are empty', () => {
    expect(
      getContactsTabs({
        propertiesAppConfig: {
          CONTACTS_TABS: [],
        } as unknown as PropertiesAppConfig,
      })
    ).toEqual([
      {
        id: 'myContacts',
        url: 'myContacts',
        label: 'My Contacts',
      },
      {
        id: 'sharedContacts',
        url: 'sharedContacts',
        label: 'Shared Contacts',
      },
    ]);
  });
});
