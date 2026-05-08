import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ScrollView } from "react-native-gesture-handler";
import SuperCryingMeowie from "@/assets/images/meowie/super-crying-meowie.svg";
import { Divider } from "@/features/common/ui/divider";
import { WarningText } from "@/features/settings/delete-account/elements/warning-text";
import { ChurnReason } from "@/features/settings/delete-account/elements/churn-reason";
import { EmailForm } from "@/features/settings/delete-account/elements/email-form";
import { useImmer } from "use-immer";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { KeyboardAvoidingWrapper } from "@/features/common/layout/keyboard-avoiding-wrapper";
import { useRef } from "react";

export const Screen = () => {
  const [churnReasonId, setChurnReasonId] = useImmer<string>("");
  const { data } = useCurrentUser();
  const email = data?.user?.email as string;

  const scrollViewRef = useRef<ScrollView>(null);
  const handleScrollToBottom = () => {
    // Small timeout ensures the keyboard view has resized before we scroll
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingWrapper>
      <InnerScreen title={"Delete Account"}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerClassName={
            "flex w-full flex-col items-center gap-8 pt-8 pb-4"
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SuperCryingMeowie />
          <WarningText />
          <Divider />
          <ChurnReason
            churnReasonId={churnReasonId}
            setChurnReasonId={setChurnReasonId}
          />
          <Divider />
          <EmailForm
            email={email}
            churnReasonId={churnReasonId}
            onInputFocus={handleScrollToBottom}
          />
        </ScrollView>
      </InnerScreen>
    </KeyboardAvoidingWrapper>
  );
};
