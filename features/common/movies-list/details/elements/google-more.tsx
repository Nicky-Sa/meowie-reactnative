import { useCallback, useEffect, useState } from "react";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
  WebBrowserResult,
} from "expo-web-browser";
import { Modal, View, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";
import Google from "@/assets/icons/google.svg";
import { allowYTPlayingAtom } from "@/atoms";
import { useAtom } from "jotai";
import { ArrowLeft } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";

type Props = {
  title: string;
};

export const GoogleMore = ({ title }: Props) => {
  const [visible, setVisible] = useState(false);
  const [browserResult, setBrowserResult] = useState<WebBrowserResult | null>(
    null,
  );
  const encodedQuery = encodeURIComponent(title);
  const uri = `https://www.google.com/search?q=${encodedQuery}`;
  const [, setAllowYTPlaying] = useAtom(allowYTPlayingAtom);

  useEffect(() => {
    if (browserResult) {
      setAllowYTPlaying(true);
    }
  }, [browserResult, setAllowYTPlaying]);

  const openLink = useCallback(async () => {
    setAllowYTPlaying(false);
    if (Platform.OS === "ios") {
      const result = await openBrowserAsync(uri, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      });
      setBrowserResult(result);
    } else {
      setVisible(true); // Open modal on Android
    }
  }, [setAllowYTPlaying, uri]);

  return (
    <>
      <Button onPress={openLink} variant={"white"} size={"md"} iconOnly>
        <Google />
      </Button>

      {Platform.OS === "android" && visible && (
        <Modal
          animationType="slide"
          visible={visible}
          onRequestClose={() => {
            setVisible(false);
          }}
        >
          <View className="flex-row items-center gap-4 bg-neutral-12-default p-2">
            <Button
              onPress={() => setVisible(false)}
              variant={"white"}
              size={"sm"}
              iconOnly
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
