import { useSelector } from 'react-redux';
import { RootState } from '@src/main.store';
import { useAppDispatch } from '@hooks/use-app-dispatch';
import { seoStore } from '@stores/swagger/rankingcoach/SeoStore';
import { AppSlice } from '@src/App.slice';

export type OnboardedAccountKeywords = {
  name: string;
}

export const useGetOnboardedAccountKeywords = () => {
  const dispatch = useAppDispatch();
  const { onboardAccountKeywords } = useSelector((state:RootState) => state.app);
  const { setOnboardAccountKeywords } = AppSlice;

  return async (search: string) => {
    seoStore.getRankingcoachSeoLocationKeywords({}).subscribe((response: any) => {
      dispatch(setOnboardAccountKeywords(response.response.location_keywords
        .onboardedAccountKeywords as OnboardedAccountKeywords[]));
      return onboardAccountKeywords;
    });
  }
}
