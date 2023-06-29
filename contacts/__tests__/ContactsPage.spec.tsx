//libs
import { render } from '@testing-library/react';

//components
import ContactsPage from '@/pages/[menuId]/[subMenuId]/contacts/tab/[tabId]';

//hooks
import * as useContactsTabs from '@/modules/contacts/hooks/useContactsTabs';

//types
import type { TabsMap } from '../types';

jest.mock('@/decorators/withPage', () => ({
  withPage: pageParams => Component => props => <Component selectedTabId="myContacts" />,
}));

jest.mock('@/components/switcherButton', () => ({
  __esModule: true,
  default: () => <div data-testid="SwitcherButton" />,
}));

jest.mock('@/modules/contacts/myContacts/components/Header', () => ({
  __esModule: true,
  default: () => <div />,
}));

jest.mock('@/modules/contacts/sharedContacts/components/body', () => ({
  Body: () => <div />,
}));

jest.mock('@/modules/contacts/myContacts/components/body', () => ({
  Body: () => <div />,
}));

jest.mock('@/modules/contacts/myContacts/components/facetsPanel', () => ({
  FacetsPanel: () => <div />,
}));

const UseContactsTabsSpy = jest.spyOn(useContactsTabs, 'useContactsTabs');

describe('ContactsPage', () => {
  test('should render `SwitcherButton` when there are more than one tab', () => {
    UseContactsTabsSpy.mockReturnValue({
      handleTabSwitch: () => null,
      tabsMap: {
        myContacts: {},
        sharedContacts: {},
      } as unknown as TabsMap,
    });

    const { getByTestId } = render(<ContactsPage selectedTabId="myContacts" />);

    expect(getByTestId('SwitcherButton')).toBeTruthy();
  });

  test('should not render `SwitcherButton` when there is only a single tab', () => {
    UseContactsTabsSpy.mockReturnValue({
      handleTabSwitch: () => null,
      tabsMap: {
        myContacts: {},
      } as unknown as TabsMap,
    });

    const { queryByTestId } = render(<ContactsPage selectedTabId="myContacts" />);

    expect(queryByTestId('SwitcherButton')).toBeFalsy();
  });
});
