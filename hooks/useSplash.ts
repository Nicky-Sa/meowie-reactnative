import { useEffect, useState } from "react";

export const useSplash = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // hide the splash after 3 sec delay
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return { isReady };
};
