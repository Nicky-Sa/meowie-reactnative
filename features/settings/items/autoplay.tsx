import { Action } from "@/features/common/ui/action";
import { Switch } from "@/features/common/ui/switch";
import { useAtom } from "jotai";
import { autoplayAtom } from "@/atoms";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

export const Autoplay = () => {
  const [value, setValue] = useAtom(autoplayAtom);
  const { settings } = useAnalytics();

  const handleToggle = () => {
    settings.trackAutoplayToggled({ autoplay: !value });
    setValue(!value);
  };

  return (
    <Action
      variant={"black"}
      onPress={handleToggle}
      icon={<Switch value={value} onValueChange={setValue} />}
    >
      Autoplay trailer
    </Action>
  );
};
