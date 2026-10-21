import { NativeIntent } from "expo-router";
import { getDefaultStore } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { getDetailsPathFromLink } from "@/features/media/data/share-links";

export const redirectSystemPath: NativeIntent["redirectSystemPath"] = ({
  path,
  initial,
}) => {
  const detailsPath = getDetailsPathFromLink(path);
  if (!detailsPath) {
    return path;
  }

  // On a cold start, the splash and Home load first, so Back from the details screen has somewhere to go.
  if (initial) {
    getDefaultStore().set(linkToOpenAtom, detailsPath);
    return "/";
  }

  return detailsPath;
};
