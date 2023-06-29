//libs
import { render, screen } from '@testing-library/react';

//components
import { Body } from '../Body';

//providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

//hooks
import * as usePaginatedEntitySelection from '@/hooks/usePaginatedEntitySelection/usePaginatedEntitySelection';

//constants
import { Profile } from '@/modules/contacts/types';
import { ENTITY_SELECTION_TYPE as PROFILE_SELECTION_TYPE } from '@/hooks/usePaginatedEntitySelection/types';

jest.mock('@/hooks/useFetchPermissibleAccountCount', () => ({
  useFetchPermissibleAccountCount: () => null,
}));

jest.mock('@/modules/contacts/components/profileCardsList', () => ({
  ProfileCardsList: () => <div>ProfileCardsList</div>,
}));

jest.mock('@/modules/contacts/components/bulkActionsBar', () => ({
  BulkActionsBar: () => <div data-testid="BulkActionsBar" />,
}));

jest.mock('@/modules/contacts/sharedContacts/hooks/useSharedContactsProfiles', () => ({
  useSharedContactsProfiles: () => ({
    data: {
      hasMore: false,
      start: 0,
      profiles: [],
      totalFound: 10,
    },
    loading: false,
    error: null,
    fetchMore: () => null,
    isPaginating: false,
    refetch: () => null,
  }),
}));

const usePaginatedEntitySelectionSpy = jest.spyOn(usePaginatedEntitySelection, 'usePaginatedEntitySelection');

describe('Body', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render `BulkActionsBar` when `profileSelection` type is `ALL`', () => {
    usePaginatedEntitySelectionSpy.mockImplementation(() => ({
      onAction: () => null,
      state: {
        entitySelection: {
          type: PROFILE_SELECTION_TYPE.ALL,
          entities: [],
          entitiesToExclude: [],
        },
      },
    }));

    render(<Body />, {
      wrapper: MockI18nProvider,
    });

    expect(screen.getByTestId('BulkActionsBar')).toBeInTheDocument();
  });

  test('should render `BulkActionsBar` when the user has selected some `profiles` and `profileSelection` type is not `ALL`', () => {
    usePaginatedEntitySelectionSpy.mockReturnValue({
      onAction: () => null,
      state: {
        entitySelection: {
          type: PROFILE_SELECTION_TYPE.ENTITIES,
          entities: [{}] as unknown as Profile[],
          entitiesToExclude: [],
        },
      },
    });

    render(<Body />, {
      wrapper: MockI18nProvider,
    });

    expect(screen.getByTestId('BulkActionsBar')).toBeInTheDocument();
  });

  test("should not render `BulkActionsBar` when the user hasn't selected any profile and `profileSelection` type is not `ALL`", () => {
    usePaginatedEntitySelectionSpy.mockReturnValue({
      onAction: () => null,
      state: {
        entitySelection: {
          type: PROFILE_SELECTION_TYPE.ENTITIES,
          entities: [],
          entitiesToExclude: [],
        },
      },
    });

    render(<Body />, {
      wrapper: MockI18nProvider,
    });

    expect(screen.queryByTestId('BulkActionsBar')).not.toBeInTheDocument();
  });
});
