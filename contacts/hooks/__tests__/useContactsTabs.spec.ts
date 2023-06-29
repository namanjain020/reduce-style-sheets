/* eslint-disable global-require -- require is needed in below tests */

//libs
import { renderHook } from '@testing-library/react-hooks';
import _identity from 'lodash/identity';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => null,
    query: {},
  }),
}));

const render = contactTabsPropertyValue => {
  jest.doMock('@/hooks/usePropertiesAppConfig', () => ({
    usePropertiesAppConfig: () => ({ CONTACTS_TABS: contactTabsPropertyValue }),
  }));

  jest.doMock('@/modules/contacts/i18n', () => ({
    useContactsTranslation: () => ({ __contactsT: _identity }),
  }));

  let useContactsTabs;

  jest.isolateModules(() => {
    useContactsTabs = require('../useContactsTabs').useContactsTabs;
  });

  return renderHook(() => useContactsTabs());
};

describe('useContactsTabs', () => {
  test('should return properly adapted tabs', () => {
    const { result } = render([
      { id: 'myContacts', label: 'My Contacts' },
      { id: 'sharedContacts', label: 'Shared Contacts' },
    ]);

    expect(result.current.tabsMap).toEqual({
      myContacts: {
        ariaLabel: 'My Contacts',
        id: 'myContacts',
        label: 'My Contacts',
      },
      sharedContacts: {
        ariaLabel: 'Shared Contacts',
        id: 'sharedContacts',
        label: 'Shared Contacts',
      },
    });
  });

  test('should not add a tab in map, if id is not present', () => {
    const { result } = render([{ label: 'My Contacts' }, { id: 'sharedContacts', label: 'Shared Contacts' }]);

    expect(result.current.tabsMap).toEqual({
      sharedContacts: {
        ariaLabel: 'Shared Contacts',
        id: 'sharedContacts',
        label: 'Shared Contacts',
      },
    });
  });

  test('should return default tabsMap, if none of the tabs has ids', () => {
    const { result } = render([{ label: 'My Contacts' }, { label: 'Shared Contacts' }]);

    expect(result.current.tabsMap).toEqual({
      myContacts: {
        ariaLabel: 'My Contacts',
        id: 'myContacts',
        label: 'My Contacts',
      },
      sharedContacts: {
        ariaLabel: 'Shared Contacts',
        id: 'sharedContacts',
        label: 'Shared Contacts',
      },
    });
  });
});
