//libs
import { renderHook } from '@testing-library/react-hooks';
import _noop from 'lodash/noop';
import { ApolloError } from '@apollo/client';

//hooks
import { useProfileAdditionFormParams } from '../useProfileAdditionFormParams';

//types
import { Profile } from '@/modules/contacts/types';

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
          profileCreationAllowed: false,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.isLoading).toEqual(true);
      expect(buttonParams?.label).toEqual('Create Contact');
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
          profileCreationAllowed: false,
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
          profileCreationAllowed: false,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `Create Contact` label if no profile was found for the given user input and `profileCreationAllowed` is true', () => {
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
          profileCreationAllowed: true,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
      expect(buttonParams?.isLoading).toEqual(undefined);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `disabled` as true if no profile was found for the given user input and `profileCreationAllowed` is false', () => {
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
          profileCreationAllowed: false,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.isLoading).toEqual(undefined);
      expect(buttonParams?.label).toEqual('Add Contact');
    });

    test('should return `disabled` as `true` if the profile was found and it is already added to contacts', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: MOCK_AUDIENCE_PROFILES,
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': true,
            },
          },
          profileCreationAllowed: true,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(true);
      expect(buttonParams?.isLoading).toEqual(undefined);
      expect(buttonParams?.label).toEqual('Create Contact');
    });

    test('should return `Add Contact` label if the profile was found and it is not already added to contacts', () => {
      const buttonParams = renderHook(() =>
        useProfileAdditionFormParams({
          channelInputValues: { TWITTER: 'abc' },
          onAction: _noop,
          addContactInProgress: true,
          loading: false,
          error: undefined,
          data: {
            profiles: MOCK_AUDIENCE_PROFILES,
            contactStatus: {
              '5f8d6eba2db5b65a46f78326': false,
            },
          },
          profileCreationAllowed: true,
        })
      ).result.current.buttonParams;

      expect(buttonParams?.disabled).toEqual(undefined);
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
          profileCreationAllowed: false,
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
          profileCreationAllowed: true,
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
          profileCreationAllowed: true,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });

    test('should return `success` intent if no profile was found for the given user input and `profileCreationAllowed` is true', () => {
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
          profileCreationAllowed: true,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('success');
      expect(bannerProps?.title).toEqual('Contact does not exist yet, you may proceed to create a new contact.');
    });

    test('should return `error` intent if no profile was found for the given user input and `profileCreationAllowed` is false', () => {
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
          profileCreationAllowed: false,
          warningMessage: 'Profile does not exist on the channel, please input a valid handle.',
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('error');
      expect(bannerProps?.title).toEqual('Profile does not exist on the channel, please input a valid handle.');
    });

    test('should return `error` intent if the profile was found and it is already added to contacts', () => {
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
            },
          },
          profileCreationAllowed: false,
        })
      ).result.current.bannerProps;

      expect(bannerProps?.intent).toEqual('error');
      expect(bannerProps?.title).toEqual('Duplicate contact found, please try a different input.');
    });

    test('should return `undefined` if the profile was found, but it is not already added to contacts', () => {
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
            },
          },
          profileCreationAllowed: false,
        })
      ).result.current.bannerProps;

      expect(bannerProps).toEqual(undefined);
    });
  });
});
