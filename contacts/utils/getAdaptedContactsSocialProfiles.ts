// libraries
import update from 'immutability-helper';

// constants
import EMPTY_ARRAY_READONLY from '@sprinklr/modules/infra/constants/emptyArray';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

// types
import { Profile } from '@/modules/contacts/types';

// utils
import { AudienceProfileEntity, SocialProfileEntity } from '@sprinklr/modules/universalEntities/profile/entities';

const SOCIAL_NETWORK_FACET_KEY = 'SN_TYPE';

/**
 * An util to set the social profiles of contacts according to the chosen social networks.
 *
 * 1. If no channel type filter is selected then return contacts as it is
 * 2. If any channel type filter is selected, then,
 *    for the contact if there is a social profile with channel type present inside selected channel,
 *    then the contact is returned with that social profile at the top,
 *    else the same contact is returned without update
 *
 * @param contacts All the contacts
 * @param selectedFacets The selected filters
 */
export function getAdaptedContactsSocialProfiles({
  contacts = EMPTY_ARRAY_READONLY,
  selectedFacets = EMPTY_OBJECT_READONLY,
}: {
  contacts: Spr.Undefined<Profile[]>;
  selectedFacets?: Spr.StringTMap<string[]>;
}): Profile[] {
  const selectedChannelTypes: string[] = selectedFacets[SOCIAL_NETWORK_FACET_KEY] || EMPTY_ARRAY_READONLY;

  if (selectedChannelTypes.length === 0) {
    return contacts;
  }

  return contacts.reduce((adaptedContacts, contact) => {
    const socialProfiles = AudienceProfileEntity.getSocialProfiles(contact);

    const selectedChannelSocialProfileIndex = socialProfiles.findIndex(socialProfile =>
      selectedChannelTypes.includes(SocialProfileEntity.getSnType(socialProfile))
    );

    if (selectedChannelSocialProfileIndex > -1) {
      const selectedChannelSocialProfile = socialProfiles[selectedChannelSocialProfileIndex];

      adaptedContacts.push(
        update(contact, {
          socialProfiles: {
            $splice: [[selectedChannelSocialProfileIndex, 1]],
            $unshift: [selectedChannelSocialProfile],
          },
        })
      );
    } else {
      adaptedContacts.push(contact);
    }

    return adaptedContacts;
  }, <Profile[]>[]);
}
