//libs
import _pick from 'lodash/pick';

//utils
import vs from 'spr-validation-schema/lib/validationSchema';
import ValidationError from 'spr-validation-schema/lib/types/ValidationError';
import { isValidPhoneNumber } from '@sprinklr/modules/infra/utils/regexUtils';

//constants
import snTypes, { SnType } from '@sprinklr/modules/infra/constants/snTypes';

//types
import { ErrorTranslationFn } from '@sprinklr/modules/error/i18n';
import { State as PhoneInputValue } from '@sprinklr/spaceweb/phone-input';

export const getPhoneNumberValidator = (__errorT: ErrorTranslationFn): Function =>
  vs.custom((phoneInput: PhoneInputValue) => {
    if (phoneInput && phoneInput.phoneNumber) {
      if (isValidPhoneNumber(phoneInput.country.dialCode + phoneInput.phoneNumber)) {
        return undefined;
      }

      return new ValidationError(__errorT('Please enter a valid number'));
    }

    return new ValidationError(__errorT('Hold on! This field cannot be blank'));
  });

export const getFormKeyVsValidatorConfigMap = (__errorT: ErrorTranslationFn): Record<SnType, Function> =>
  ({
    [snTypes.EMAIL.type]: vs.string().email(__errorT('Please enter a valid e-mail')).required(),

    [snTypes.TWITTER.type]: vs.string().required(),

    [snTypes.LINKEDIN.type]: vs.string().required(),

    [snTypes.SMS.type]: getPhoneNumberValidator(__errorT),

    [snTypes.WHATSAPP_BUSINESS.type]: getPhoneNumberValidator(__errorT),
  } as Record<SnType, Function>);

export const getValidationSchema = ({
  channels,
  __errorT,
}: {
  channels: SnType[];
  __errorT: ErrorTranslationFn;
}): Spr.StringAnyMap => vs.object(_pick(getFormKeyVsValidatorConfigMap(__errorT), channels));
