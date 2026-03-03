import { OnboardedAccountKeywords } from '@hooks/use-get-onboarded-account-keywords';

export const useMapLocationKeywords = (keywordsArray: any): OnboardedAccountKeywords[] => {
  const keywords: OnboardedAccountKeywords[] = [];
  keywordsArray.forEach((keyword: any) => {
    let instance = {
      name: keyword.keyword.name
    } as OnboardedAccountKeywords;
    keywords.push(instance);
  });
  return keywords;
}
