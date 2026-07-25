import { View } from "react-native";
import { cn } from "@/lib/tailwind";

const TOTAL_STEPS = 6;

// Always the movies (purple) accent, matching the designs — the per-step
// series accent only colours that step's own selections, not the progress.
export const TasteProgress = ({ step }: { step: number }) => {
  return (
    <View className={"flex flex-row items-center gap-2"}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          className={cn(
            "flex-1 rounded-full",
            index < step
              ? "h-1 bg-neutral-8-default"
              : "h-0.5 bg-neutral-10-default",
          )}
        />
      ))}
    </View>
  );
};
