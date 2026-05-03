import { useState, useCallback } from "react";
import { Text, TextLayoutEvent } from "react-native";
import { Button } from "@/features/common/ui/button";

type Props = {
  overview: string;
};

export const Overview = ({ overview }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const onTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      if (e.nativeEvent.lines.length > 5 && !expanded) {
        setShowMore(true);
      }
    },
    [expanded],
  );

  return (
    <>
      <Text
        numberOfLines={expanded ? undefined : 5}
        onTextLayout={onTextLayout}
        className={"body-b2 leading-5 text-neutral-8-default"}
      >
        {overview}
      </Text>
      {showMore && !expanded && (
        <Button
          variant={"link"}
          onPress={() => setExpanded(true)}
          className={"mt-1"}
          hitSlop={10}
        >
          More
        </Button>
      )}
    </>
  );
};
