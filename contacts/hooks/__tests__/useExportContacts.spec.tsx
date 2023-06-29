// libraries
import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';

// providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

// constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';

// hooks
import { useExportContacts, EXPORT_CONTACTS_MUTATION } from '../useExportContacts';

// queries
import { FACETS_METADATA_QUERY } from '@/modules/contacts/queries';

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

jest.mock('@/hooks/useSnackbarNotifications', () => ({
  useSnackbarNotifications: () => ({ onSuccess: mockOnSuccess, onError: mockOnError }),
}));

const customRenderHook = <P, R>(
  callback: (props: P) => R,
  mocks: MockedProviderProps['mocks'] = EMPTY_ARRAY_READONLY
): RenderHookResult<P, R> =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <MockedProvider
        mocks={[{ request: { query: FACETS_METADATA_QUERY }, result: { data: { facetsMetadata: [] } } }, ...mocks]}
      >
        <MockI18nProvider>{children}</MockI18nProvider>
      </MockedProvider>
    ),
  });

describe('useExportContacts', () => {
  test('should execute mutation with `myContactsAudienceProfileRequestDTO` and `sharedContactsAudienceProfileRequestDTO` if called with `[`myContacts`, `sharedContacts`]`', async () => {
    const { result } = customRenderHook(
      () => useExportContacts(),
      [
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
          result: { data: { dstExportContacts: { id: '1910202' } } },
        },
      ]
    );

    await result.current[0](['myContacts', 'sharedContacts']);

    expect(mockOnSuccess).toHaveBeenCalledWith({
      message:
        'Your export request has been received. We will notify you after it is processed and the report is generated.',
    });
  });

  test('should execute mutation with `myContactsAudienceProfileRequestDTO` if called with `[`myContacts`]`', async () => {
    const { result } = customRenderHook(
      () => useExportContacts(),
      [
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
          result: { data: { dstExportContacts: { id: '1910202' } } },
        },
      ]
    );

    await result.current[0](['myContacts']);

    expect(mockOnSuccess).toHaveBeenCalledWith({
      message:
        'Your export request has been received. We will notify you after it is processed and the report is generated.',
    });
  });

  test('should execute mutation with `sharedContactsAudienceProfileRequestDTO` if called with `[`sharedContacts`]`', async () => {
    const { result } = customRenderHook(
      () => useExportContacts(),
      [
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
          result: { data: { dstExportContacts: { id: '1910202' } } },
        },
      ]
    );

    await result.current[0](['sharedContacts']);

    expect(mockOnSuccess).toHaveBeenCalledWith({
      message:
        'Your export request has been received. We will notify you after it is processed and the report is generated.',
    });
  });

  test('should call `onError` notification if mutation fails', async () => {
    const { result } = customRenderHook(
      () => useExportContacts(),
      [
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
          error: new Error('Some error'),
        },
      ]
    );

    await result.current[0](['sharedContacts']);

    expect(mockOnError).toHaveBeenCalledWith({
      message: 'Your export request has failed. Kindly, please check the filters and contacts access and try again.',
    });
  });
});
