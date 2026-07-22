import { View } from "react-native";
import { tailwind } from "@/lib/tailwind";

const TOTAL_STEPS = 6;

/**
 * The wizard's step progress bar. Always the movies (purple) accent, matching
 * the designs — the per-step series/green accent only colours that step's own
 * selections, not the progress. Rendered once in the taste layout so it stays
 * put across step transitions.
 */
export const TasteProgress = ({ step }: { step: number }) => {
  return (
    <View className={"flex flex-row items-center gap-2"}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          className={"flex-1 rounded-full"}
          style={{
            backgroundColor:
              index < step
                ? tailwind.theme.backgroundColor.neutral[8].default
                : tailwind.theme.backgroundColor.neutral[10].default,
            height: index < step ? 4 : 2,
          }}
        />
      ))}
    </View>
  );
};
