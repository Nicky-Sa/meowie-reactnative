import { useAtom } from "jotai";
import { useEffect } from "react";
import { jumpToFirstItemAtom } from "@/atoms";
import { TabsName } from "@/app/(tabs)/_layout";

type Props = {
  tabName: TabsName | null;
  jumpToFirstItemFn: () => void;
};

export const useJumpToFirstItem = ({ tabName, jumpToFirstItemFn }: Props) => {
  const [jumpToFirstItem, setJumpToFirstItem] = useAtom(jumpToFirstItemAtom);

  useEffect(() => {
    if (jumpToFirstItem === tabName) {
      jumpToFirstItemFn();
      setJumpToFirstItem(null);
    }
  }, [jumpToFirstItem, setJumpToFirstItem, tabName]);
};
