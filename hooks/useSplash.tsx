import { useEffect, useRef } from "react";


export const useSplash = (isLoading : boolean) => {
  const isReady = useRef(false);
  useEffect(() => {
    // hide the splash after 3 sec delay
    const timeout = setTimeout(() => {
      isReady.current = true;
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return { isReady: isLoading ? false : isReady.current };
};
