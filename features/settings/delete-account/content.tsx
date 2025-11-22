import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ScrollView } from "react-native-gesture-handler";
import SuperCryingMeowie from "@/assets/images/super-crying-meowie.svg";
import { Divider } from "@/features/common/divider";
import { WarningText } from "@/features/settings/delete-account/elements/warning-text";
import { ChooseReason } from "@/features/settings/delete-account/elements/choose-reason";
import { EmailForm } from "@/features/settings/delete-account/elements/email-form";
import { useImmer } from "use-immer";

export const Content = () => {
  const [reasonId, setReasonId] = useImmer<string>("");

  return (
    <InnerScreen title={"Delete Account"}>
      <ScrollView
        contentContainerClassName={"flex w-full flex-col items-center gap-8"}
        showsVerticalScrollIndicator={false}
      >
        <SuperCryingMeowie />
        <WarningText />
        <Divider />
        <ChooseReason reasonId={reasonId} setReasonId={setReasonId} />
        <Divider />
        <EmailForm email={"benjamin@gmail.com"} reasonId={reasonId} />
      </ScrollView>
    </InnerScreen>
  );
};
