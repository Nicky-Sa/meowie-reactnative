import { useState, useEffect } from "react";

export const useIsInitialRender = () => {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsInitialRender(false);
    });
  }, []);

  return isInitialRender;
};
