/**
 * Created by: Raj Meghpara
 * Date: 2021-01-20
 * Time: 16:07
 */

//constants
import { CONTACTS_TYPES } from './constants';

//types
import { AudienceProfile, SocialProfile } from '@sprinklr/modules/universalEntities/profile/types';
import { ContactsWorkflowTranslationFn } from './i18n';
import { WorkflowTranslationFn } from '@sprinklr/modules/workflow/i18n';
import { ConfiguredMacro, Macros } from '@/types/macro';
import { EntitySelection } from '@/hooks/usePaginatedEntitySelection/types';

export type TabsMap = Spr.StringTMap<{ label: string; id: ContactsType; ariaLabel: string; url: string }>;

export type ContactsType = Spr.ValueOf<typeof CONTACTS_TYPES>;

export type Profile = AudienceProfile;

export type FacetsMetadata = Array<{
  additional: Spr.StringAnyMap;
  id: string;
  displayName: string;
  fieldType: string;
  priority: number;
  rangeFacet: boolean;
}>;

export type FacetField = {
  key: string;
  label: string;
  field: string;
};

export type Facet = {
  facetField: FacetField;
  options: Array<{
    value: string;
    key: string;
    label: string;
    count: number;
    selected: boolean;
  }>;
};

export type ReplyBoxProps = {
  socialProfile: Spr.Undefined<SocialProfile>;
  target: Spr.Null<EventTarget>;
  closeReplyBox: () => void;
};

export type SelectedFilters = {
  filters: Spr.StringTMap<string[]>;
  clientCustomProperties: Spr.StringTMap<string[]>;
  partnerCustomProperties: Spr.StringTMap<string[]>;
};

export type ActionParams = {
  allowedMacroActions: Array<ConfiguredMacro>;
  macros: Macros;
  __contactsWorkflowT: ContactsWorkflowTranslationFn;
  __workflowT: WorkflowTranslationFn;
};

export type AudienceProfileRequestDTOInput = {
  sortInfo: { [sortKey: string]: string };
  excludeFacetFields: boolean;
  facetFields: FacetsMetadata;
  filters: Spr.StringTMap<string[]>;
  start: number;
  rows: number;
  clientCustomProperties: Spr.StringTMap<string[]>;
  query: string;
  excludeFilters?: {
    ID?: Array<string>;
  };
};

export type ProfileSelection = EntitySelection<Profile>;
