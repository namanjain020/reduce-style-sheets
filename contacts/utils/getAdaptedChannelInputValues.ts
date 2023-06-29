//libs
import _reduce from 'lodash/reduce';
import _isString from 'lodash/isString';

//types
import { ChannelInputValues } from '@/modules/contacts/components/addContacts/types';
import { SnType } from '@sprinklr/modules/infra/constants/snTypes';

export const getAdaptedChannelInputValues = (values: ChannelInputValues): Partial<Record<SnType, string>> =>
  _reduce(
    values,
    (acc, value, snKey) => {
      if (!_isString(value)) {
        acc[snKey] = value ? value.country.dialCode + value.phoneNumber : '';
      } else {
        acc[snKey] = value;
      }
      return acc;
    },
    {} as Partial<Record<SnType, string>>
  );
