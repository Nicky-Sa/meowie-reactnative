import * as StoreReview from "expo-store-review";
import { useAtom } from "jotai";
import { reviewAskedAtAtom } from "@/atoms";

const ASK_AGAIN_AFTER_DAYS = 90;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const isReviewDue = (askedAt: string, now: Date) =>
  askedAt === "" ||
  now.getTime() - Date.parse(askedAt) >= ASK_AGAIN_AFTER_DAYS * DAY_IN_MS;

/** Asks for Apple's rating popup at most once every 90 days. Apple still decides whether it shows. */
export const useAskForReview = () => {
  const [askedAt, setAskedAt] = useAtom(reviewAskedAtAtom);

  return async () => {
    const now = new Date();
    if (!isReviewDue(askedAt, now)) return;
    setAskedAt(now.toISOString());

    // isAvailableAsync() checks for the popup only; hasAction() can send people to the App Store page instead.
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      }
    } catch (error) {
      console.error("Could not ask for an App Store review:", error);
    }
  };
};
