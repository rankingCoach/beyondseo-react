import { useAppDispatch } from '@hooks/use-app-dispatch';
import { SeoStore } from '@stores/swagger/rankingcoach/SeoStore';

export const useInitiate = () => {
  const dispatch = useAppDispatch();

  const accountKeywords = () => {
    return dispatch(SeoStore.getRankingcoachSeoLocationKeywordsThunk({}))
      .unwrap()
  };

  return {
    accountKeywords,
  };
};
