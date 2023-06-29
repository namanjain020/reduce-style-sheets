/**
 * Created by: Raj Meghpara
 * Date: 2021-08-07
 * Time: 15:55
 */

//libs
import _reduce from 'lodash/reduce';

//utils
import vs from 'spr-validation-schema/lib/validationSchema';

//types
import { ChannelInputValues, FieldConfig } from '../../types';
import snTypes, { SnType } from '@sprinklr/modules/infra/constants/snTypes';
import type { I18nextTFunction } from '@sprinklr/modules/sprI18Next';

//constants
import { LINKEDIN_URL_START_ENHANCER } from '@/modules/contacts/components/addContacts/constants';
import EMPTY_OBJECT_READONLY from '@sprinklr/modules/infra/constants/emptyObject';

export const getValidationSchema = (fields: FieldConfig[], __commonT: I18nextTFunction) => {
  const validationConfig = fields.reduce((acc, field) => {
    if (field.required) {
      acc[field.fieldName] = vs.string().required(__commonT("Hold on! This field can't be blank."));
    }

    return acc;
  }, {});

  return vs.object(validationConfig);
};

const SN_TYPE_TO_INITIAL_VALUES = {
  [snTypes.LINKEDIN.type]: (searchedKeyword: string): { url: string } => ({
    url: searchedKeyword.startsWith(LINKEDIN_URL_START_ENHANCER)
      ? searchedKeyword
      : LINKEDIN_URL_START_ENHANCER + searchedKeyword,
  }),
  [snTypes.EMAIL.type]: (searchedKeyword: string): { email: string } => ({
    email: searchedKeyword,
  }),
  [snTypes.SMS.type]: (searchedKeyword: string): { pNo: string } => ({
    pNo: searchedKeyword,
  }),
  [snTypes.WHATSAPP_BUSINESS.type]: (searchedKeyword: string): { pNo: string } => ({
    pNo: searchedKeyword,
  }),
};

export const getInitialValues = (channelInputValues: ChannelInputValues): Spr.StringStringMap =>
  _reduce(
    channelInputValues,
    (result: Spr.StringStringMap, value: string, key: SnType) =>
      Object.assign(result, SN_TYPE_TO_INITIAL_VALUES[key]?.(value)),
    {}
  );
