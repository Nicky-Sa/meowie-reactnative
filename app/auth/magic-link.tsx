import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  connectAuthEmulator,
} from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as Application from "expo-application";

const useEmulator = false;

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const auth = getAuth();

  // --------------------------------
  useEffect(() => {
    if (__DEV__ && useEmulator) {
      try {
        // REPLACE with your local IP
        const emulatorUrl = "http://192.168.1.186:9099";
        connectAuthEmulator(auth, emulatorUrl);
        console.log("Connected to Auth Emulator");
      } catch (error) {
        console.log("Failed to connect to Auth Emulator: ", error);
      }
    }
  }, [auth]);
  // --------------------------------

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string | null }) => {
      if (!url) return;

      // 3. Use modular function: pass 'auth' instance as first arg
      // Note: isSignInWithEmailLink is synchronous in the modular SDK
      const isSignInLink = await isSignInWithEmailLink(auth, url);

      if (isSignInLink) {
        setLoading(true);
        try {
          // Retrieve the email the user typed earlier
          const emailToConfirm = await AsyncStorage.getItem("emailForSignIn");

          // Fallback: If user switched devices, they must re-type it
          if (!emailToConfirm) {
            Alert.alert(
              "Email required",
              "Please re-enter your email to confirm sign-in.",
            );
            setLoading(false);
            return;
          }

          // Complete the Sign In
          await signInWithEmailLink(auth, emailToConfirm, url);

          // Cleanup
          await AsyncStorage.removeItem("emailForSignIn");
          // Note: Session is now persistent automatically by the Native SDK.
          // You can navigate to your Home screen here.
        } catch (error) {
          console.log("Login Failed: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Cold Start: App was closed and opened via link
    Linking.getInitialURL().then((url) => {
      handleDeepLink({ url });
    });

    // Warm Start: App was in background and opened via link
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, [auth]);

  const handleSendLink = async () => {
    if (!email) {
      return Alert.alert("Error", "Please enter an email address.");
    }

    setLoading(true);
    try {
      const appId = Application.applicationId;
      if (!appId) {
        throw new Error("No app id");
      }

      const actionCodeSettings = {
        url: "https://auth.meowie.app/auth/magic-link",
        handleCodeInApp: true,
        iOS: {
          bundleId: appId,
        },
        android: {
          packageName: appId,
          installApp: true,
          minimumVersion: "12",
        },
      };

      // 5. Update send link call
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email locally to complete the flow later without asking again
      await AsyncStorage.setItem("emailForSignIn", email);

      setIsLinkSent(true);
      Alert.alert("Check your inbox", `Link sent to ${email}`);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 20 }}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Enter your email to sign in without a password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLinkSent}
      />

      <Button
        title={isLinkSent ? "Link Sent! Send again?" : "Send Magic Link"}
        onPress={handleSendLink}
      />

      {isLinkSent && (
        <Text style={styles.hint}>
          Go to your email app and click the link to log in.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    fontSize: 18,
    borderRadius: 8,
    marginBottom: 20,
  },
  hint: {
    marginTop: 20,
    color: "green",
    textAlign: "center",
  },
});
