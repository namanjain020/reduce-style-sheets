/**
 * Created by: Raj Meghpara
 * Date: 2021-08-06
 * Time: 13:44
 */

//constants
import snTypes from '@sprinklr/modules/infra/constants/snTypes';

//utils
import { getShifuFilter } from '@/utils/general';
import { getLinkedInUrl } from './helpers/getLinkedInUrl';

export const ACTION_TYPES = {
  GO_TO_NEXT_SCREEN: 'GO_TO_NEXT_SCREEN',
  GO_TO_PREVIOUS_SCREEN: 'GO_TO_PREVIOUS_SCREEN',
  SELECT_CHANNELS: 'SELECT_CHANNELS',
  ADD_CONTACT: 'ADD_CONTACT',
  CHANGE_CHANNEL_INPUT_VALUES: 'CHANGE_CHANNEL_INPUT_VALUES',
};

export const LOADING_STATUS = {
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  IDLE: 'IDLE',
} as const;

export const SCREEN_TYPES = {
  PROFILE_CHANNELS_SELECTOR: 'PROFILE_CHANNELS_SELECTOR',
  PROFILE_PREVIEW_SCREEN: 'PROFILE_PREVIEW_SCREEN',
  CONTACT_CREATION_SCREEN: 'CONTACT_CREATION_SCREEN',
} as const;

export const LINKEDIN_URL_START_ENHANCER = 'https://www.linkedin.com/in/';

export const SN_TYPE_TO_INPUT_START_ENHANCER = {
  [snTypes.TWITTER.type]: '@',
  [snTypes.LINKEDIN.type]: LINKEDIN_URL_START_ENHANCER,
};

export const PROFILE_HANDLE_SEARCH_SUPPORTING_CHANNELS = new Set([snTypes.TWITTER.type]);

export const CHANNEL_TYPE_TO_PROFILE_SEARCH_FILTER_GETTER = {
  [snTypes.LINKEDIN.type]: (searchedKeyword: string, startEnhancer = '') =>
    getShifuFilter('PROFILE_URL', [getLinkedInUrl(searchedKeyword, startEnhancer)]),
  [snTypes.EMAIL.type]: (email: string) => getShifuFilter('EMAIL', [email]),
  [snTypes.SMS.type]: (phoneNumber: string) => getShifuFilter('snId', [phoneNumber]),
  [snTypes.WHATSAPP_BUSINESS.type]: (phoneNumber: string) => getShifuFilter('snId', [phoneNumber]),
  [snTypes.TWITTER.type]: (username: string) => getShifuFilter('username', [username]),
};

export const CONTACT_SCREENS = [
  SCREEN_TYPES.PROFILE_CHANNELS_SELECTOR,
  SCREEN_TYPES.PROFILE_PREVIEW_SCREEN,
  SCREEN_TYPES.CONTACT_CREATION_SCREEN,
];

export const CONTACT_MODAL_OVERRIDES = { Dialog: { style: { width: '62rem', height: '58rem' } } };
