//libs
import { renderHook } from '@testing-library/react-hooks';
import _noop from 'lodash/noop';
import { ApolloError } from '@apollo/client';

//hooks
import { useProfileAdditionFormParams } from '../useProfileAdditionFormParams';

//types
import { Profile } from '@/modules/contacts/types';

jest.mock('@/modules/contacts/components/addContacts/hooks/useCreateContact', () => ({
  useCreateContact: () => ({
    createContact: () => null,
    loading: false,
  }),
}));

const MOCK_AUDIENCE_PROFILES = [
  {
    contactInfo: {
      email: 'charlie.puth@voicenotes.com',
      firstName: 'Charlie',
      fullName: 'Charlie Puth',
      lastName: 'Puth',
    },
    demographics: { location: 'us' },
    id: '5f8d6eba2db5b65a46f78326',
    socialProfiles: [
      { username: 'abc', snId: 'kkk', snType: 'TWITTER' },
      { name: 'xyz', snId: 'pho', snType: 'SMS' },
      { username: '123', snId: 'bbb', snType: 'LINKEDIN' },
    ],
  },
  {
    contactInfo: {
      email: 'sprinklr.abs@sprinklr.com',
      firstName: 'Sprinklr',
      fullName: 'Sprinklr abs',
      lastName: 'abs',
    },
    demographics: { location: 'us' },
    id: '5f8d6eba2db1111111111',
    socialProfiles: [
      { username: 'abc', snId: 'kkk', snType: 'TWITTER' },
      { name: 'xyz', snId: 'pho', snType: 'SMS' },
      { username: '123', snId: 'bbb', snType: 'LINKEDIN' },
    ],
  },
] as unknown as Profile[];

describe('useProfileAdditionFormParams', () => {
  describe('buttonParams', () => {
    test('should return `isLoading` as true if `loading` is `true`', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: true,
          error: undefined,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.isLoading).toEqual(true);
    });

    test('should return `disabled` as true if error is non-empty', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: new Error('network error') as ApolloError,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `disabled` as true if user has not yet searched any profile', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `Create Contact` label if no profile was found for the given user input', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { EMAIL: 'anmol.kansal@sprinklr.com' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: [],
            contactStatus: {},
          },
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
      expect(buttonParams?.isLoading).toEqual(undefined);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `disabled` as `true` if only a single profile was found, contains all the searched social profiles and it is already added to contacts', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': true,
              '5f8d6eba2db1111111111': true,
            },
          },
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.isLoading).toEqual(undefined);
      expect(buttonParams?.label).toEqual('Add Contact');
    });

    test('should return `Add Contact` label if only a single profile was found, but does not contain all the searched social profiles', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'phso' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': true,
              '5f8d6eba2db1111111111': true,
            },
          },
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
      expect(buttonParams?.isLoading).toEqual(false);
      expect(buttonParams?.label).toEqual('Add Contact');
    });

    test('should return `Add Contact` label if only a single profile was found, but it is not already added to contacts', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': false,
              '5f8d6eba2db1111111111': false,
            },
          },
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
      expect(buttonParams?.isLoading).toEqual(false);
      expect(buttonParams?.label).toEqual('Add Contact');
    });

    test('should return `Add Contact` label if more than 1 profiles were returned', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: MOCK_AUDIENCE_PROFILES,
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': false,
              '5f8d6eba2db1111111111': false,
            },
          },
          onClose: () => null,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
      expect(buttonParams?.isLoading).toEqual(false);
      expect(buttonParams?.label).toEqual('Add Contact');
    });
  });

  describe('bannerProps', () => {
    test('should return `undefined if `loading` is `true`', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: true,
          error: undefined,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });

    test('should return undefined if error is non-empty', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: new Error('network error') as ApolloError,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });

    test('should return undefined if user has not yet searched any profile', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: {},
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: undefined,
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });

    test('should return `success` intent if no profile was found for the given user input', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { EMAIL: 'anmol.kansal@sprinklr.com' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: [],
            contactStatus: {},
          },
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('success');
      expect(bannerProps?.title).toEqual('Contact does not exist yet, you may proceed to create a new contact.');
    });

    test('should return `error` intent if only a single profile was found, contains all the searched social profiles and it is already added to contacts', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': true,
              '5f8d6eba2db1111111111': true,
            },
          },
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('error');
      expect(bannerProps?.title).toEqual('Duplicate contact found, please try a different input.');
    });

    test('should return `warning` intent if only a single profile was found, but does not contain all the searched social profiles', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'phso' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': true,
              '5f8d6eba2db1111111111': true,
            },
          },
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('warning');
      expect(bannerProps?.title).toEqual(
        'Following contact already exists. If you proceed all social contacts would be merged. This is an irreversible action.'
      );
    });

    test('should return `undefined` if only a single profile was found, but it is not already added to contacts', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: [MOCK_AUDIENCE_PROFILES[0]],
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': false,
              '5f8d6eba2db1111111111': false,
            },
          },
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });

    test('should return `warning` intent if more than 1 profiles were returned', () => {
      const bannerProps = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc', SMS: 'pho' },
          onAction: _noop,
          addContactInProgress: false,
          loading: false,
          error: undefined,
          data: {
            profiles: MOCK_AUDIENCE_PROFILES,
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': false,
              '5f8d6eba2db1111111111': false,
            },
          },
          onClose: () => null,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('warning');
      expect(bannerProps?.title).toEqual(
        'Following contact already exists. If you proceed all social contacts would be merged. This is an irreversible action.'
      );
    });
  });
});
