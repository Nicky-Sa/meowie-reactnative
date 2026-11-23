import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

/** Lets a scroll view scroll only while its content is taller than the view itself. */
export const useScrollOnlyWhenNeeded = () => {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent.layout.height);
  };

  const onContentSizeChange = (_width: number, height: number) => {
    setContentHeight(height);
  };

  // Content that fits can still measure a fraction of a point taller than the view
  const scrollEnabled = contentHeight - viewHeight > 1;

  return { scrollEnabled, onLayout, onContentSizeChange };
};
