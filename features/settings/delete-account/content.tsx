import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ScrollView } from "react-native-gesture-handler";
import SuperCryingMeowie from "@/assets/images/super-crying-meowie.svg";
import { Divider } from "@/features/common/divider";
import { WarningText } from "@/features/settings/delete-account/elements/warning-text";
import { ChurnReason } from "@/features/settings/delete-account/elements/churn-reason";
import { EmailForm } from "@/features/settings/delete-account/elements/email-form";
import { useImmer } from "use-immer";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";

export const Content = () => {
  const [churnReasonId, setChurnReasonId] = useImmer<string>("");
  const { data } = useCurrentUser();
  // if the user is not logged in, we don't even show the button to navigate to this screen
  const email = data?.user?.email as string;

  return (
    <InnerScreen title={"Delete Account"}>
      <ScrollView
        contentContainerClassName={
          "flex w-full flex-col items-center gap-8 pt-8"
        }
        showsVerticalScrollIndicator={false}
      >
        <SuperCryingMeowie />
        <WarningText />
        <Divider />
        <ChurnReason
          churnReasonId={churnReasonId}
          setChurnReasonId={setChurnReasonId}
        />
        <Divider />
        <EmailForm email={email} churnReasonId={churnReasonId} />
      </ScrollView>
    </InnerScreen>
  );
};
