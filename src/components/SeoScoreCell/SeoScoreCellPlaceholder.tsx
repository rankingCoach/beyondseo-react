import { Skeleton, SkeletonTypes } from "vanguard";
import * as styles from "./SeoScoreCellPlaceholder.module.scss";

export const SeoScoreCellPlaceholder = () => {
  return <Skeleton type={SkeletonTypes.rectangle} width={140} height={32}></Skeleton>;
};
