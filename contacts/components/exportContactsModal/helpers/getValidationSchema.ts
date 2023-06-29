// libraries
import _isEmpty from 'lodash/isEmpty';

// utils
import vs from 'spr-validation-schema/lib/validationSchema';
import ValidationError from 'spr-validation-schema/lib/types/ValidationError';

// constants
import { FIELD_IDS } from '../constants';

// types
import { ErrorTranslationFn } from '@sprinklr/modules/error/i18n';

export const getValidationSchema = (__errorT: ErrorTranslationFn): typeof vs =>
  vs.object({
    [FIELD_IDS.CONTACT_TYPES]: vs.custom(value => {
      if (_isEmpty(value)) {
        return new ValidationError(__errorT('Please choose at least one option'));
      }

      return null;
    }),
  });
