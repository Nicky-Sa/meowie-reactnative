import { useCallback, useEffect, useState } from "react";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
  WebBrowserResult,
} from "expo-web-browser";
import { Modal, View, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";
import Google from "@/assets/icons/google.svg";
import { isYTPlayingAtom } from "@/atoms";
import { useAtom } from "jotai";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import { Button } from "@/components/common/button";

type Props = {
  title: string;
};

export const GoogleIt = ({ title }: Props) => {
  const [visible, setVisible] = useState(false);
  const [browserResult, setBrowserResult] = useState<WebBrowserResult | null>(
    null,
  );
  const encodedQuery = encodeURIComponent(title);
  const uri = `https://www.google.com/search?q=${encodedQuery}`;
  const [, setPlaying] = useAtom(isYTPlayingAtom);

  useEffect(() => {
    if (browserResult) {
      setPlaying(true);
    }
  }, [browserResult, setPlaying]);

  const openLink = useCallback(async () => {
    setPlaying(false);
    if (Platform.OS === "ios") {
      const result = await openBrowserAsync(uri, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      });
      setBrowserResult(result);
    } else {
      setVisible(true); // Open modal on Android
    }
  }, [setPlaying, uri]);

  return (
    <>
      <Button
        onPress={openLink}
        variant={"ghost"}
        size={"unset"}
        className={"self-start"}
      >
        <Google />
      </Button>

      {Platform.OS === "android" && visible && (
        <Modal animationType="slide" visible={visible}>
          <View className="flex-row items-center gap-4 bg-neutral-12-default p-2">
            <Button
              onPress={() => setVisible(false)}
              variant={"secondary"}
              size={"sm"}
              square
            >
              <ArrowLeft />
            </Button>
            <Text className={"body-b1-strong text-neutral-10-default"}>
              Back to app
            </Text>
          </View>
          <WebView source={{ uri }} />
        </Modal>
      )}
    </>
  );
};
