//helpers
import { getSearchRequest } from '../getSearchRequest';

describe('getSearchRequest', () => {
  test('should add Twitter Filter in Filters if user has searched Twitter Profile', () => {
    const filters = getSearchRequest({ TWITTER: 'elonmusk' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['TWITTER'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'username',
          values: ['elonmusk'],
        }),
      ])
    );
  });

  test('should add LinkedIn Filter in Filters if user has searched LinkedIn Profile', () => {
    const filters = getSearchRequest({ LINKEDIN: 'elonmusk' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['LINKEDIN'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'PROFILE_URL',
          values: ['https://www.linkedin.com/in/elonmusk/'],
        }),
      ])
    );
  });

  test('should add Sms Filter in Filters if user has searched Sms Profile', () => {
    const filters = getSearchRequest({ SMS: '+547689782132' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['SMS'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'snId',
          values: ['+547689782132'],
        }),
      ])
    );
  });

  test('should add Whatsapp Business Filter in Filters if user has searched Whatsapp Business Profile', () => {
    const filters = getSearchRequest({ WHATSAPP_BUSINESS: '+547689782132' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['WHATSAPP_BUSINESS'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'snId',
          values: ['+547689782132'],
        }),
      ])
    );
  });

  test('should add Email Filter in Filters if user has searched Email Profile', () => {
    const filters = getSearchRequest({ EMAIL: 'anmol.kansal@sprinklr.com' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['EMAIL'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'EMAIL',
          values: ['anmol.kansal@sprinklr.com'],
        }),
      ])
    );
  });

  test('should add both Email and SMS Filter in Filters if user has searched both Email and Sms Profiles', () => {
    const filters = getSearchRequest({ EMAIL: 'anmol.kansal@sprinklr.com', SMS: '+547689782132' }).filters;

    expect(filters.getFilters()[0].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['EMAIL'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'EMAIL',
          values: ['anmol.kansal@sprinklr.com'],
        }),
      ])
    );

    expect(filters.getFilters()[1].getFilters()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filterType: 'IN',
          field: 'SN_TYPE',
          values: ['SMS'],
        }),

        expect.objectContaining({
          filterType: 'IN',
          field: 'snId',
          values: ['+547689782132'],
        }),
      ])
    );
  });
});
