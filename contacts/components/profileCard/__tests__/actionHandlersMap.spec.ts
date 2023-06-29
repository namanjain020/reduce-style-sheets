//libs
import { waitFor } from '@testing-library/react';

//utils
import * as macroService from '@space/core/services/macroService';
import { __testApplyMacroAction, actionHandlers } from '../actionHandlersMap';
import { __mockT } from '@sprinklr/modules/infra/tests/mockI18n';

//types
import { AudienceProfile } from '@sprinklr/modules/universalEntities/profile/types';

const applyMacroServiceSpy = jest.spyOn(macroService, 'applyMacro');

const _identity = x => x;
const MOCK_AUDIENCE_PROFILE = {
  contactInfo: {
    email: 'charlie.puth@voicenotes.com',
    firstName: 'Charlie',
    fullName: 'Charlie Puth',
    lastName: 'Puth',
    phoneNo: '4167465789',
    website: ['https://www.charlieputh.com/'],
  },
  demographics: { location: 'us' },
  id: '5f8d6eba2db5b65a46f78326',
  socialProfiles: [],
} as unknown as AudienceProfile;

jest.mock('@space/core/entityReaders/Macro', () => ({
  __esModule: true,
  default: {
    name: () => 'DST Macro',
    id: () => '123',
  },
}));

describe('applyMacroAction', () => {
  afterEach(() => {
    jest.resetModules();
  });

  test('should apply macro when the applyMacro call has succeeded and dispatch success notification ', async () => {
    const mockDispatch = jest.fn();
    const mockOnAction = jest.fn();

    applyMacroServiceSpy.mockImplementation(() => Promise.resolve({}));

    await __testApplyMacroAction({
      macro: {
        name: 'DST Macro',
        key: '123',
        description: 'macro',
        id: '123',
        additional: {},
        properties: { buttonName: 'MACRO' },
      },
      searchedKeyword: '456fgb',
      manualActionDataByMacroId: {},
      dispatch: mockDispatch,
      fetchAudienceProfile: () => null,
      profile: MOCK_AUDIENCE_PROFILE,
      __macroT: _identity,
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls).toEqual([
      [{ type: 'DST_NOTIFICATION_SHOW', params: expect.objectContaining({ type: 'success' }) }],
    ]);
  });

  test('should fail safely when the applyMacro call has failed and dispatch error notification ', async () => {
    const mockDispatch = jest.fn();
    const mockOnAction = jest.fn();

    applyMacroServiceSpy.mockImplementation(() => Promise.reject(new Error('failed')));

    await __testApplyMacroAction({
      macro: {
        name: 'DST Macro',
        key: '123',
        description: 'macro',
        id: '123',
        additional: {},
        properties: { buttonName: 'MACRO' },
      },
      searchedKeyword: '456fgb',
      manualActionDataByMacroId: {},
      dispatch: mockDispatch,
      fetchAudienceProfile: () => null,
      profile: MOCK_AUDIENCE_PROFILE,
      __macroT: _identity,
    });

    expect(mockOnAction).toHaveBeenCalledTimes(0);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls).toEqual([
      [{ type: 'DST_NOTIFICATION_SHOW', params: expect.objectContaining({ type: 'error' }) }],
    ]);
  });

  describe('Delete Action', () => {
    const deleteActionHandler = actionHandlers.DELETE;

    const mockOnError = jest.fn();
    const mockOnSuccess = jest.fn();

    const mockParams = {
      cache: {
        identify: () => null,
        evict: () => null,
        gc: () => null,
      },
      closeThirdPane: () => null,
      __commonT: __mockT,
      __contactsT: __mockT,
      onSuccess: mockOnSuccess,
      onError: mockOnError,
      tabLabel: 'my contacts',
      profile: {
        id: '213124134',
        socialProfiles: [
          {
            name: 'Anmol',
            snType: 'TWITTER',
            snId: '12648731924',
          },
        ],
      },
      socialProfile: {
        name: 'Anmol',
        snType: 'TWITTER',
        snId: '12648731924',
      },
      trigger: ({ payload: { onConfirmation } }) => onConfirmation(() => null),
    };

    test('should show success notification if contact is removed successfully', async () => {
      deleteActionHandler(
        { payload: {} },
        {
          params: {
            ...mockParams,
            deleteContact: () => Promise.resolve({}),
            contactType: 'myContacts',
            tabsMap: {
              myContacts: {
                label: 'my contacts',
                ariaLabel: 'my contacts',
                id: 'myContacts',
                url: 'myContacts',
              },
            },
          },
        }
      );

      await waitFor(() =>
        expect(mockOnSuccess).toHaveBeenCalledWith({
          message: 'I have removed Anmol from your my contacts.',
        })
      );
    });

    test('should show error notification if there was an error while removing contact', async () => {
      deleteActionHandler(
        { payload: {} },
        {
          params: {
            ...mockParams,
            deleteContact: () => Promise.reject(new Error('Failed')),
            contactType: 'myContacts',
            tabsMap: {
              myContacts: {
                label: 'my contacts',
                ariaLabel: 'my contacts',
                id: 'myContacts',
                url: 'myContacts',
              },
            },
          },
        }
      );

      await waitFor(() =>
        expect(mockOnError).toHaveBeenCalledWith({
          message: "I couldn't remove Anmol from your my contacts.",
        })
      );
    });
  });
});
