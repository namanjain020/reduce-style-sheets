//libs
import { render, screen } from '@testing-library/react';

//components
import { EmptyContacts } from '../EmptyContacts';

jest.mock('@/modules/contacts/components/AddContactButton', () => ({
  AddContactButton: () => <div data-testid="add-contact" />,
}));

describe('EmptyContacts', () => {
  test('should render Add Contact button if is My Contacts stream', () => {
    render(<EmptyContacts selectedTab="myContacts" />);

    screen.getByTestId('add-contact');
  });

  test('should not render Add Contact button if is Shared Contacts stream', () => {
    render(<EmptyContacts selectedTab="sharedContacts" />);

    expect(screen.queryByTestId('add-contact')).toBe(null);
  });

  test('should render only primary message if the `selectedTab` is `myContacts`', () => {
    render(<EmptyContacts selectedTab="myContacts" />);

    expect(screen.getByText(/No contacts found/i)).toBeTruthy();
    expect(screen.queryByText(/Please check again later/i)).toBeFalsy();
  });

  test('should render both primary and secondary messages if the `selectedTab` is `sharedContacts`', () => {
    render(<EmptyContacts selectedTab="sharedContacts" />);

    expect(screen.getByText(/No contacts found/i)).toBeTruthy();
    expect(screen.getByText(/Please check again later/i)).toBeTruthy();
  });
});
