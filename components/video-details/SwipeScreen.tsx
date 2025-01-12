import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_HEIGHT * 0.3;

interface SwipeScreenProps {
  id: string;
  backgroundColor: string;
}

const SwipeScreen: React.FC<SwipeScreenProps> = ({ id, backgroundColor }) => {
  return (
    <View style={[styles.screenContainer, { backgroundColor }]}>
      <Text style={styles.idText}>ID: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: SCREEN_HEIGHT,
  },
  idText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});

export default SwipeScreen;
