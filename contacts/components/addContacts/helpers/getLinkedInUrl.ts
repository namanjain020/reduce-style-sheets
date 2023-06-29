export const getLinkedInUrl = (searchedKeyword: string, startEnhancer = ''): string => {
  const linkedInUrl: string = searchedKeyword.startsWith(startEnhancer)
    ? searchedKeyword.split('?')[0]
    : startEnhancer + searchedKeyword;

  return linkedInUrl + (linkedInUrl.endsWith('/') ? '' : '/');
};
