//utils
import { getAdaptedChannelInputValues } from '../getAdaptedChannelInputValues';

//types
import { ChannelInputValues } from '@/modules/contacts/components/addContacts/types';

const MOCK_VALUES = {
  SMS: {
    country: {
      dialCode: '+91',
      label: 'India',
      id: 'IN',
    },
    phoneNumber: '9999999999',
  },
  EMAIL: 'v@sprinklr.com',
} as unknown as ChannelInputValues;

describe('getAdaptedChannelInputValues', () => {
  test('should adapt channel input values by joining dialCode and phone number if value is of phone input type and not adapt when value is string', () => {
    expect(getAdaptedChannelInputValues(MOCK_VALUES)).toEqual({ SMS: '+919999999999', EMAIL: 'v@sprinklr.com' });
  });
});
