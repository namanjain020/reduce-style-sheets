/*
 * Created on: Tue May 25 2021 12:58:24 PM
 * Author: Apar Garg
 */

//types
import { ContactsTranslationFn } from './i18n';

export const CONTACTS_TYPES = {
  MY_CONTACTS: 'myContacts',
  SHARED_CONTACTS: 'sharedContacts',
} as const;

export const DEFAULT_SORT_DETAILS = { sortKey: 'MODIFIED_TIME', sortOrder: 'DESC' };

export const FACET_TYPE_VS_PAYLOAD_KEY = {
  FILTER: 'filters',
  CUSTOM_FIELD: 'clientCustomProperties',
  PARTNER_CUSTOM_FIELD: 'partnerCustomProperties',
};

export const getDefaultContactsTabs = (__contactsT: ContactsTranslationFn) => [
  { id: CONTACTS_TYPES.MY_CONTACTS, label: __contactsT('My Contacts'), url: 'myContacts' },
  { id: CONTACTS_TYPES.SHARED_CONTACTS, label: __contactsT('Shared Contacts'), url: 'sharedContacts' },
];
