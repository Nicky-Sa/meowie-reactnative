import { useState } from "react";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
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

type Props = {
  title: string;
};

export const GoogleIt = ({ title }: Props) => {
  const [visible, setVisible] = useState(false);
  const encodedQuery = encodeURIComponent(title);
  const uri = `https://www.google.com/search?q=${encodedQuery}`;

  const openLink = () => {
    if (Platform.OS === "ios") {
      openBrowserAsync(uri, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } else {
      setVisible(true); // Open modal on Android
    }
  };

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
