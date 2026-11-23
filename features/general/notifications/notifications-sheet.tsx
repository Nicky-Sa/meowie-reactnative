import { Text, View } from "react-native";
import LottieView from "lottie-react-native";
import notificationCatAnimation from "@/assets/lottie/notification-cat.json";
import { BottomSheet } from "@/features/common/ui/bottom-sheet";
import { Button } from "@/features/common/ui/button";
import { useNotificationsSheet } from "@/features/general/notifications/hooks/use-notifications-sheet";

const benefits = [
  { title: "New collections", text: "Fresh lists to explore, added often." },
  { title: "Big releases", text: "Popular movies and series, out now." },
  { title: "Top matches", text: "Titles that fit you the best." },
];

export const NotificationsSheet = () => {
  const { sheetRef, close, onDismiss, turnOn } = useNotificationsSheet();

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      enableDynamicSizing
      canClose={false}
      onDismiss={onDismiss}
      footer={
        <View className="flex-col gap-3">
          <Button variant="primary" size="lg" fullWidth onPress={turnOn}>
            Turn on notifications
          </Button>
          <Button variant="ghost" size="lg" fullWidth onPress={close}>
            Skip for now
          </Button>
        </View>
      }
    >
      <View className="items-center gap-4 pt-4 tall-sm:gap-8">
        <View className="h-[113px] w-[140px] tall-sm:h-[171px] tall-sm:w-[212px]">
          <LottieView
            source={notificationCatAnimation}
            autoPlay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View className="w-full gap-2 px-8">
          <Text className="title-t1-strong text-center text-neutral-10-default">
            {"Don't miss what's next"}
          </Text>
          <Text className="body-b1 text-center text-neutral-5-default">
            Get a ping when something on your list is ready to watch.
          </Text>
        </View>
        <View className="w-full gap-4 px-6 tall-sm:py-4">
          {benefits.map((benefit) => (
            <View key={benefit.title} className="gap-0.5">
              <Text className="body-b1-strong text-neutral-10-default">
                {benefit.title}
              </Text>
              <Text className="body-b2 text-neutral-5-default">
                {benefit.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};
