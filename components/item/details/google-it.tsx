import { useCallback, useEffect, useState } from "react";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
  WebBrowserResult,
} from "expo-web-browser";
import {
  Pressable,
  Modal,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import Google from "@/assets/icons/google.svg";
import { isYTPlayingAtom } from "@/atoms";
import { useAtom } from "jotai";

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
      <Pressable onPress={openLink}>
        <Google />
      </Pressable>

      {Platform.OS === "android" && visible && (
        <Modal animationType="slide" transparent={false} visible={visible}>
          <View className="h-12 flex-row items-center bg-gray-100 px-4">
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Google width={24} height={24} />
            </TouchableOpacity>
          </View>
          <WebView source={{ uri }} />
        </Modal>
      )}
    </>
  );
};
