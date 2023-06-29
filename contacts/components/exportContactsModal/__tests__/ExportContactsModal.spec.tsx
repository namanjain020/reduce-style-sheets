// libraries
import { render, RenderResult, screen, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';

// components
import { ExportContactsModal } from '../ExportContactsModal';

// queries
import { FACETS_METADATA_QUERY } from '@/modules/contacts/queries';
import { EXPORT_CONTACTS_MUTATION } from '@/modules/contacts/hooks/useExportContacts';

// providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';
import AppConfigProvider from '@/contexts/appConfig';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

jest.mock('@/hooks/useSnackbarNotifications', () => ({
  useSnackbarNotifications: () => ({ onSuccess: mockOnSuccess, onError: mockOnError }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => {},
    query: {
      menuId: 'jbvjirfj9300sgjr',
      subMenuId: 'sopteiop392229',
    },
  }),
}));

const customRender = (element: ReactElement): RenderResult =>
  render(element, {
    wrapper: ({ children }) => (
      <MockedProvider
        mocks={[
          { request: { query: FACETS_METADATA_QUERY }, result: { data: { facetsMetadata: [] } } },
          {
            request: {
              query: EXPORT_CONTACTS_MUTATION,
              variables: {
                myContactsAudienceProfileRequestDTO: {
                  clientCustomProperties: {},
                  excludeFacetFields: true,
                  facetFields: [],
                  filters: {},
                  partnerCustomProperties: {},
                  query: '',
                  rows: 20,
                  sortInfo: { MODIFIED_TIME: 'DESC' },
                  start: 0,
                },
                sharedContactsAudienceProfileRequestDTO: {
                  clientCustomProperties: {},
                  excludeFacetFields: true,
                  facetFields: [],
                  filters: {},
                  partnerCustomProperties: {},
                  query: '',
                  rows: 20,
                  sortInfo: { MODIFIED_TIME: 'DESC' },
                  start: 0,
                },
              },
            },
            result: { data: { dstExportContacts: '1910202' } },
          },
          {
            request: {
              query: EXPORT_CONTACTS_MUTATION,
              variables: {
                myContactsAudienceProfileRequestDTO: {
                  clientCustomProperties: {},
                  excludeFacetFields: true,
                  facetFields: [],
                  filters: {},
                  partnerCustomProperties: {},
                  query: '',
                  rows: 20,
                  sortInfo: { MODIFIED_TIME: 'DESC' },
                  start: 0,
                },
              },
            },
            result: { data: { dstExportContacts: '1910202' } },
          },
          {
            request: {
              query: EXPORT_CONTACTS_MUTATION,
              variables: {
                sharedContactsAudienceProfileRequestDTO: {
                  clientCustomProperties: {},
                  excludeFacetFields: true,
                  facetFields: [],
                  filters: {},
                  partnerCustomProperties: {},
                  query: '',
                  rows: 20,
                  sortInfo: { MODIFIED_TIME: 'DESC' },
                  start: 0,
                },
              },
            },
            result: { data: { dstExportContacts: '1910202' } },
          },
        ]}
      >
        <MockI18nProvider>
          <AppConfigProvider
            appConfig={{
              APP_PROPERTIES: [
                {
                  assetInfo: {
                    assetObjects: [
                      {
                        CONTACTS_TABS: [
                          {
                            label: 'My Contacts dst',
                            id: 'myContacts',
                          },
                          {
                            label: 'Shared Contacts dst',
                            id: 'sharedContacts',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            }}
          >
            {children}
          </AppConfigProvider>
        </MockI18nProvider>
      </MockedProvider>
    ),
  });

describe('ExportContactsModal', () => {
  test('should render `ContactsFromSelectInput` with options specified in `appConfig`', () => {
    customRender(<ExportContactsModal onClose={() => {}} />);

    userEvent.click(screen.getByPlaceholderText('Select Contact Type'));

    expect(screen.getByText('My Contacts dst')).toBeInTheDocument();
    expect(screen.getByText('Shared Contacts dst')).toBeInTheDocument();
  });

  test('should display error message when no option is selected and form is submitted', async () => {
    customRender(<ExportContactsModal onClose={() => {}} />);

    userEvent.click(screen.getByTestId('export-contacts-button'));

    await waitFor(() => expect(screen.getByText('Please choose at least one option')).toBeInTheDocument());
  });

  test('should execute `exportContacts` mutation with `myContactsAudienceProfileRequestDTO` as a variable when only `myContacts` is selected', async () => {
    customRender(<ExportContactsModal onClose={() => {}} />);

    userEvent.click(screen.getByPlaceholderText('Select Contact Type'));
    userEvent.click(screen.getByText('My Contacts dst'));
    userEvent.click(screen.getByTestId('export-contacts-button'));

    await waitFor(() =>
      expect(mockOnSuccess).toHaveBeenCalledWith({
        message:
          'Your export request has been received. We will notify you after it is processed and the report is generated.',
      })
    );
  });

  test('should execute `exportContacts` mutation with `sharedContactsAudienceProfileRequestDTO` as a variable when only `sharedContacts` is selected', async () => {
    customRender(<ExportContactsModal onClose={() => {}} />);

    userEvent.click(screen.getByPlaceholderText('Select Contact Type'));
    userEvent.click(screen.getByText('Shared Contacts dst'));
    userEvent.click(screen.getByTestId('export-contacts-button'));

    await waitFor(() =>
      expect(mockOnSuccess).toHaveBeenCalledWith({
        message:
          'Your export request has been received. We will notify you after it is processed and the report is generated.',
      })
    );
  });

  test('should execute `exportContacts` mutation with `myContactsAudienceProfileRequestDTO` and `sharedContactsAudienceProfileRequestDTO` as variables when both options are selected', async () => {
    customRender(<ExportContactsModal onClose={() => {}} />);

    userEvent.click(screen.getByPlaceholderText('Select Contact Type'));
    userEvent.click(screen.getByText('My Contacts dst'));
    userEvent.click(screen.getByText('Shared Contacts dst'));
    userEvent.click(screen.getByTestId('export-contacts-button'));

    await waitFor(() =>
      expect(mockOnSuccess).toHaveBeenCalledWith({
        message:
          'Your export request has been received. We will notify you after it is processed and the report is generated.',
      })
    );
  });
});
