//libs
import { render, screen } from '@testing-library/react';

//components
import { BulkActionsBar, Props } from '../BulkActionsBar';

//providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

jest.mock('@sprinklr/modules/infra/components/bulkActionsBar/layout/SelectionLabel', () => ({
  SelectionLabel: ({ label }) => <div>{label}</div>,
}));

const MOCK_PROPS = {
  onAction: () => null,
  profiles: [],
} as unknown as Props;

jest.mock('@/hooks/usePropertiesAppConfig', () => ({
  usePropertiesAppConfig: () => ({}),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => null,
    query: {},
  }),
}));

jest.mock('@sprinklr/modules/infra/hooks/useQuery', () => ({
  useQuery: () => ({
    data: null,
    loading: true,
  }),
}));

describe('BulkActionsBar', () => {
  describe('Header label', () => {
    test('should render the count of the contacts selected when the user has selected multiple contacts', () => {
      render(<BulkActionsBar {...MOCK_PROPS} totalProfilesCount={5} selectedProfilesCount={2} />, {
        wrapper: MockI18nProvider,
      });

      expect(screen.getByText('2 Contacts Selected')).toBeInTheDocument();
    });

    test('should render the count of the contacts selected when the user has selected 1 contact', () => {
      render(<BulkActionsBar {...MOCK_PROPS} totalProfilesCount={5} selectedProfilesCount={1} />, {
        wrapper: MockI18nProvider,
      });

      expect(screen.getByText('1 Contact Selected')).toBeInTheDocument();
    });
  });
});
