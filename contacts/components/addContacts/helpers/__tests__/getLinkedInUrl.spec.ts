import { getLinkedInUrl } from '../getLinkedInUrl';

const LINKEDIN_URL_START_ENHANCER = 'https://www.linkedin.com/in/';

describe('getLinkedInUrl', () => {
  test('should return url with start enhancer and linkedIn handle along with `/` on end when only linkedIn user handle is typed', () => {
    expect(getLinkedInUrl('pranav', LINKEDIN_URL_START_ENHANCER)).toEqual('https://www.linkedin.com/in/pranav/');
  });

  test('should return url along with `/` on end when complete profile url typed', () => {
    expect(getLinkedInUrl('https://www.linkedin.com/in/pranav', LINKEDIN_URL_START_ENHANCER)).toEqual(
      'https://www.linkedin.com/in/pranav/'
    );
  });

  test('should remove query params if they are provided in the url', () => {
    expect(
      getLinkedInUrl(
        'https://www.linkedin.com/in/amritmaansingh/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=in?',
        LINKEDIN_URL_START_ENHANCER
      )
    ).toEqual('https://www.linkedin.com/in/amritmaansingh/');
  });
});
