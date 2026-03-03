import { Skeleton, SkeletonTypes } from "vanguard";

export const ScoreButtonHeaderPlaceholder = () => {
  return <Skeleton type={SkeletonTypes.rectangle} width={90} height={32}></Skeleton>;
};
