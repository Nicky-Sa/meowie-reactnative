import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export const Slider = () => {
  const [values, setValues] = useState([4, 7]);

  return (
    <View>
      <MultiSlider
        values={values}
        min={0}
        max={10}
        step={1}
        onValuesChange={setValues}
        selectedStyle={{ backgroundColor: "#6366F1", height: 8 }}
        unselectedStyle={{
          backgroundColor: "#404040",
          height: 8,
          borderRadius: 4,
        }}
        markerOffsetY={4}
        markerStyle={styles.marker}
        sliderLength={340}
      />
      <View style={styles.valueLabels}>
        <Text style={styles.valueText}>{values[0]}</Text>
        <Text style={styles.valueText}>{values[1]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
    marginBottom: 16,
    fontWeight: "500",
  },
  valueLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  valueText: {
    color: "white",
  },
  marker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "black",
  },
});
