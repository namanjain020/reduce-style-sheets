//libs
import { renderHook } from '@testing-library/react-hooks';

//hooks
import { useBulkActions } from '../useBulkActions';

//providers
import { MockI18nProvider } from '@sprinklr/modules/infra/tests/MockI18nProvider';

//rules
import '@/factory/actionsFactory/actions/contactActions/contactActionRules';

//types
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import { ProfileSelection, Profile } from '@/modules/contacts/types';

const mockChannelsAllowedToBeMerged = ['EMAIL', 'SMS'] as Array<SnType>;

jest.mock('@/hooks/usePropertiesAppConfig', () => ({
  usePropertiesAppConfig: () => ({}),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => null,
    query: {},
  }),
}));

describe('useBulkActions', () => {
  test("should return `SELECT_ALL` action if the user hasn't selected all the profiles", () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: false,
          selectedTab: 'myContacts',
          selectedProfilesCount: 10,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Select All',
          icon: 'selectAll',
          action: 'SELECT_ALL',
          trackerEventId: '@contacts/bulkActionsBar/SelectAll',
        }),
      ])
    );
  });

  test('should return `UNSELECT_ALL` action if the user has selected all the profiles', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'myContacts',
          selectedProfilesCount: 10,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Clear Selection',
          icon: 'selectAll',
          action: 'UNSELECT_ALL',
          trackerEventId: '@contacts/bulkActionsBar/ClearSelection',
        }),
      ])
    );
  });

  test('should return enabled `DELETE` action if the `selectedTab` is of type `myContacts`', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'myContacts',
          selectedProfilesCount: 10,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Delete',
          action: 'DELETE',
          disabled: false,
          trackerEventId: '@contacts/bulkActionsBar/Delete',
        }),
      ])
    );
  });

  test('should return disabled `DELETE` action if the `selectedTab` is of type `sharedContacts`', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'sharedContacts',
          selectedProfilesCount: 10,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Delete',
          action: 'DELETE',
          disabled: true,
          trackerEventId: '@contacts/bulkActionsBar/Delete',
        }),
      ])
    );
  });

  test('should return disabled `MERGE` action and tooltip if the `selectedTab` is of type `sharedContacts`', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'sharedContacts',
          selectedProfilesCount: 2,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Merge',
          icon: 'merge',
          action: 'MERGE',
          disabled: true,
          tooltip: 'You cannot merge Shared Contacts.',
        }),
      ])
    );
  });

  test('should return disabled `MERGE` action and tooltip if the user has selected more than 2 contacts', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'myContacts',
          selectedProfilesCount: 3,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Merge',
          icon: 'merge',
          action: 'MERGE',
          disabled: true,
          tooltip: 'Only two profiles can be merged together at once.',
        }),
      ])
    );
  });

  test('should return disabled `MERGE` action and tooltip if at least one of the selected profiles does not contain any mergeable social profile', () => {
    const MOCK_PROFILES = [
      {
        socialProfiles: [
          {
            snType: 'TWITTER',
          },
          { snType: 'WHATSAPP_BUSINESS' },
        ],
      },
      {
        socialProfiles: [
          {
            snType: 'SMS',
          },
        ],
      },
    ] as unknown as Profile[];

    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'myContacts',
          selectedProfilesCount: 2,
          profileSelection: {
            entities: MOCK_PROFILES,
          } as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Merge',
          icon: 'merge',
          action: 'MERGE',
          disabled: true,
          tooltip: 'Only EMAIL and SMS contacts can be merged together.',
        }),
      ])
    );
  });

  test(
    'should return enabled `MERGE` action, if the user has selected exactly 2 contacts, both are of type `myContacts` and' +
      'all of the selected profiles contain at least one mergeable social profile',
    () => {
      const MOCK_PROFILES = [
        {
          socialProfiles: [
            {
              snType: 'EMAIL',
            },
            { snType: 'WHATSAPP_BUSINESS' },
          ],
        },
        {
          socialProfiles: [
            {
              snType: 'SMS',
            },
          ],
        },
      ] as unknown as Profile[];

      const { result } = renderHook(
        () =>
          useBulkActions({
            areAllProfilesSelected: true,
            selectedTab: 'myContacts',
            selectedProfilesCount: 2,
            profileSelection: {
              entities: MOCK_PROFILES,
            } as unknown as ProfileSelection,
            channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
          }),
        { wrapper: MockI18nProvider }
      );

      expect(result.current).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Merge',
            icon: 'merge',
            action: 'MERGE',
            disabled: false,
          }),
        ])
      );
    }
  );

  test('should return `ADD_TO_PROFILE_LISTS` action', () => {
    const { result } = renderHook(
      () =>
        useBulkActions({
          areAllProfilesSelected: true,
          selectedTab: 'myContacts',
          selectedProfilesCount: 3,
          profileSelection: {} as unknown as ProfileSelection,
          channelsAllowedToBeMerged: mockChannelsAllowedToBeMerged,
        }),
      { wrapper: MockI18nProvider }
    );

    expect(result.current).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Add to Contact Lists',
          icon: 'contact',
          action: 'ADD_TO_PROFILE_LISTS',
          trackerEventId: '@contacts/bulkActionsBar/AddToProfileLists',
        }),
      ])
    );
  });
});
