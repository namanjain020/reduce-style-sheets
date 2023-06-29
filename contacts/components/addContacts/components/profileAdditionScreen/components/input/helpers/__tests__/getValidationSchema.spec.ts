//utils
import { getValidationSchema } from '../getValidationSchema';
import { __mockT } from '@sprinklr/modules/infra/tests/mockI18n';
import { validate } from 'spr-validation-schema/lib/validate';

//types
import { ErrorTranslationFn } from '@sprinklr/modules/error/i18n';

describe('getValidationSchema', () => {
  describe('Email Input', () => {
    const validationSchema = getValidationSchema({
      channels: ['EMAIL'],
      __errorT: __mockT as ErrorTranslationFn,
    });

    test('should return error if the input value is empty', () => {
      const errorMessage = validate({ EMAIL: '' }, validationSchema)?.EMAIL;

      expect(errorMessage).toEqual('Hold on! This field cannot be blank');
    });

    test('should return error if the input value is not a valid e-mail', () => {
      const errorMessage = validate({ EMAIL: 'anmol.kansal' }, validationSchema)?.EMAIL;

      expect(errorMessage).toEqual('Please enter a valid e-mail');
    });

    test('should return undefined if the input value is a valid e-mail', () => {
      const errorMessage = validate({ EMAIL: 'anmol.kansal@sprinklr.com' }, validationSchema)?.EMAIL;

      expect(errorMessage).toEqual(undefined);
    });
  });

  describe('Twitter Input', () => {
    const validationSchema = getValidationSchema({
      channels: ['TWITTER'],
      __errorT: __mockT as ErrorTranslationFn,
    });

    test('should return error if the input value is empty', () => {
      const errorMessage = validate({ TWITTER: '' }, validationSchema)?.TWITTER;

      expect(errorMessage).toEqual('Hold on! This field cannot be blank');
    });

    test('should return undefined if the input value is non-empty', () => {
      const errorMessage = validate({ TWITTER: 'elonmusk' }, validationSchema)?.TWITTER;

      expect(errorMessage).toEqual(undefined);
    });
  });

  describe('LinkedIn Input', () => {
    const validationSchema = getValidationSchema({
      channels: ['LINKEDIN'],
      __errorT: __mockT as ErrorTranslationFn,
    });

    test('should return error if the input value is empty', () => {
      const errorMessage = validate({ LINKEDIN: '' }, validationSchema)?.LINKEDIN;

      expect(errorMessage).toEqual('Hold on! This field cannot be blank');
    });

    test('should return undefined if the input value is non-empty', () => {
      const errorMessage = validate({ LINKEDIN: 'elonmusk' }, validationSchema)?.LINKEDIN;

      expect(errorMessage).toEqual(undefined);
    });
  });

  describe('Sms Input', () => {
    const validationSchema = getValidationSchema({
      channels: ['SMS'],
      __errorT: __mockT as ErrorTranslationFn,
    });

    test('should return error if the input value is empty', () => {
      const errorMessage = validate({ SMS: { phoneNumber: '', country: { dialCode: '+91' } } }, validationSchema)?.SMS;

      expect(errorMessage).toEqual('Hold on! This field cannot be blank');
    });

    test('should return error if the number of digits in phoneNumber are less than 6', () => {
      const errorMessage = validate(
        { SMS: { phoneNumber: '891', country: { dialCode: '+91' } } },
        validationSchema
      )?.SMS;

      expect(errorMessage).toEqual('Please enter a valid number');
    });

    test('should return error if the number of digits in phoneNumber are more than 15', () => {
      const errorMessage = validate(
        { SMS: { phoneNumber: '1231231231231234', country: { dialCode: '+91' } } },
        validationSchema
      )?.SMS;

      expect(errorMessage).toEqual('Please enter a valid number');
    });

    test('should return undefined if the phoneNumber is non-empty and number of digits in phoneNumber are between 6 and 15', () => {
      const errorMessage = validate(
        { SMS: { phoneNumber: '8768', country: { dialCode: '+91' } } },
        validationSchema
      )?.SMS;

      expect(errorMessage).toEqual(undefined);
    });
  });

  describe('Whatsapp Business Input', () => {
    const validationSchema = getValidationSchema({
      channels: ['WHATSAPP_BUSINESS'],
      __errorT: __mockT as ErrorTranslationFn,
    });

    test('should return error if the input value is empty', () => {
      const errorMessage = validate({ WHATSAPP_BUSINESS: '' }, validationSchema)?.WHATSAPP_BUSINESS;

      expect(errorMessage).toEqual('Hold on! This field cannot be blank');
    });

    test('should return error if the number of digits in phoneNumber are less than 6', () => {
      const errorMessage = validate(
        { WHATSAPP_BUSINESS: { phoneNumber: '891', country: { dialCode: '+91' } } },
        validationSchema
      )?.WHATSAPP_BUSINESS;

      expect(errorMessage).toEqual('Please enter a valid number');
    });

    test('should return error if the number of digits in phoneNumber are more than 15', () => {
      const errorMessage = validate(
        { WHATSAPP_BUSINESS: { phoneNumber: '1231231231231234', country: { dialCode: '+91' } } },
        validationSchema
      )?.WHATSAPP_BUSINESS;

      expect(errorMessage).toEqual('Please enter a valid number');
    });

    test('should return undefined if the phoneNumber is non-empty and number of digits in phoneNumber are between 6 and 15', () => {
      const errorMessage = validate(
        { WHATSAPP_BUSINESS: { phoneNumber: '8768', country: { dialCode: '+91' } } },
        validationSchema
      )?.WHATSAPP_BUSINESS;

      expect(errorMessage).toEqual(undefined);
    });
  });
});
