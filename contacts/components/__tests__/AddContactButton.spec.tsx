//libs
import { render } from '@testing-library/react';

//components
import { AddContactButton } from '../AddContactButton';

//hooks
import * as usePropertiesAppConfig from '@/hooks/usePropertiesAppConfig';

//types
import { PropertiesAppConfig } from '@/types/appConfig';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useApolloClient: () => ({}),
}));

jest.mock('@sprinklr/modules/platform/buttonActions', () => ({
  useButton: () => ({
    trigger: jest.fn(),
  }),
}));

const usePropertiesAppConfigSpy = jest.spyOn(usePropertiesAppConfig, 'usePropertiesAppConfig');

describe('AddContactButton', () => {
  test('should render `Add Contact` button when `ADD_CONTACTS` feature is enabled', () => {
    usePropertiesAppConfigSpy.mockImplementation(
      () =>
        ({
          ADD_CONTACTS: true,
        } as PropertiesAppConfig)
    );

    const { getByTestId } = render(<AddContactButton />);

    expect(getByTestId('add-contact')).toBeTruthy();
  });

  test('should not render `Add Contact` when `ADD_CONTACTS` feature is disabled', () => {
    usePropertiesAppConfigSpy.mockImplementation(
      () =>
        ({
          ADD_CONTACTS: false,
        } as PropertiesAppConfig)
    );

    const { queryByTestId } = render(<AddContactButton />);

    expect(queryByTestId('add-contact')).toBeFalsy();
  });
});
