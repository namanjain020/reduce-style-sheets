// libraries
import { render, screen, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// components
import MoreActionButton from '../MoreActionsButton';

// providers
import { MockSprEnvContextProvider } from '@space/core/contexts/sprEnv/MockSprEnvContextProvider';
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

const mockGetValueOrFunction = jest.fn().mockReturnValue(['EMAIL']);
const mockUseAclStorePermission = jest.fn().mockReturnValue(true);
const mockPush = jest.fn();

jest.mock('@sprinklr/modules/platform/buttonActions', () => ({ useButton: () => ({ trigger: x => x }) }));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      menuId: 'menuId',
      subMenuId: 'subMenuId',
    },
    push: mockPush,
  }),
}));

jest.mock('@/contexts/featureUtils/useFeatureUtils', () => ({
  useFeatureUtils: () => ({
    getValueOrFunction: mockGetValueOrFunction,
  }),
}));

jest.mock('@/hooks/useAclStorePermission', () => ({
  useAclStorePermission: () => mockUseAclStorePermission(),
}));

const customRender = (isConsentFormsEnabled = true, isExportContactsEnabled = true): RenderResult =>
  render(<MoreActionButton />, {
    wrapper: ({ children }) => (
      <MockSprEnvContextProvider
        mockRawSprEnv={{
          userContext: {
            dynamicProperties: {
              CONSENT_FORMS_ENABLED: isConsentFormsEnabled,
              DST_PROFILE_EXPORT_ENABLED: isExportContactsEnabled,
            },
          },
        }}
      >
        <MockI18nProvider>{children}</MockI18nProvider>
      </MockSprEnvContextProvider>
    ),
  });

describe('MoreActionsButton', () => {
  describe('ProfileList Manager', () => {
    test('should render ProfileList Manager in options when profile list view permission is enabled and email is allowed as channel in contacts', () => {
      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.getByTestId('profile-list-manager-button')).toBeInTheDocument();
    });

    test('should not render profile list manager in options when profile list view permission is enabled but email is not allowed as channel in contacts', () => {
      mockGetValueOrFunction.mockReturnValueOnce(['TWITTER', 'LINKEDIN']);

      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.queryByTestId('profile-list-manager-button')).not.toBeInTheDocument();
    });

    test('should not render profile list manager in options when profile list view permission is disabled but email is allowed as channel in contacts', () => {
      mockUseAclStorePermission.mockReturnValueOnce(false);

      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.queryByTestId('profile-list-manager-button')).not.toBeInTheDocument();
    });

    test('should not render profile list manager in options when profile list view permission is disabled and email is not allowed as channel in contacts', () => {
      mockUseAclStorePermission.mockReturnValueOnce(false);

      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.queryByTestId('profile-list-manager-button')).not.toBeInTheDocument();
    });

    test('should open `Profile List` manager when user clicks `Contact List Manager` button', () => {
      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      userEvent.click(screen.getByTestId('profile-list-manager-button'));

      expect(mockPush).toHaveBeenCalledWith('/menuId/subMenuId/contacts/manager');
    });
  });

  describe('Consent Form', () => {
    test('should render Consent Form in options if CONSENT_FORMS_ENABLED is true', () => {
      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.getByTestId('consent-form-button')).toBeInTheDocument();
    });

    test('should not render Consent Form in options if CONSENT_FORMS_ENABLED is false', () => {
      customRender(false);

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.queryByTestId('consent-form-button')).not.toBeInTheDocument();
    });

    test('should open `Consent Form` page when user clicks `Consent Form` button', () => {
      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      userEvent.click(screen.getByTestId('consent-form-button'));

      expect(mockPush).toHaveBeenCalledWith('/menuId/subMenuId/contacts/consentForm');
    });
  });

  describe('Export Contacts', () => {
    test('should render `Export` button within menu if `DST_PROFILE_EXPORT_ENABLED` DP is enabled', () => {
      customRender();

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.getByTestId('export-contacts-button')).toBeInTheDocument();
    });

    test('should not render `Export` button within menu if `DST_PROFILE_EXPORT_ENABLED` DP is disabled', () => {
      customRender(true, false);

      userEvent.click(screen.getByTestId('more-button'));

      expect(screen.queryByTestId('export-contacts-button')).not.toBeInTheDocument();
    });
  });
});
