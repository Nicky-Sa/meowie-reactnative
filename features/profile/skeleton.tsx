import { SkeletonItem } from "@/features/common/ui/skeleton-item";

export const Skeleton = () => {
  return (
    <>
      <SkeletonItem className={"h-24 w-24 rounded-full"} />
      <SkeletonItem className={"h-8"} />
      <SkeletonItem className={"h-10"} />
      <SkeletonItem className={"h-12"} />
    </>
  );
};
