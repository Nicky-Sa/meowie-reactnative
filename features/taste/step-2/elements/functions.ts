import { FlexibilityOption } from "@/features/taste/step-2/data/use-flexibility-options";

/**
 * Maps the selected flexibility option to a 0–1 Lottie progress value
 * (first option → 0, last option → 1). Returns 0 when the options haven't
 * loaded yet or nothing is selected, so the animation has a safe resting frame.
 */
export const mapFlexibilityToAnimationProgress = (
  flexibilityOptions: FlexibilityOption[],
  selectedFlexibilityId: string | null,
): number => {
  const lastIndex = flexibilityOptions.length - 1;
  if (lastIndex < 0) return 0;

  const index = flexibilityOptions.findIndex(
    (option) => option.id === selectedFlexibilityId,
  );
  if (index < 0) return 0;

  return lastIndex === 0 ? 1 : index / lastIndex;
};
