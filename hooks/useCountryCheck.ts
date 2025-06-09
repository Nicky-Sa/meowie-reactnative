import { useEffect, useState } from "react";

const countryList = [
  "IR", // Iran
  "SY", // Syria
  "CU", // Cuba
  "RU", // Russia
  "CN", // China
  "TM", // Turkmenistan
  "ER", // Eritrea
];

export const useCountryCheck = () => {
  const [showVPNAlert, setShowVPNAlert] = useState(false);

  useEffect(() => {
    async function checkCountry() {
      try {
        const response = await fetch("https://ipinfo.io/json");
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        const data = await response.json();

        if (countryList.includes(data.country)) {
          setShowVPNAlert(true);
        }
      } catch (error) {
        const statusCode = Number((error as Error)?.message);
        if (statusCode < 500 && statusCode >= 400) {
          // 400 errors are client errors and can be fixed by VPNs
          setShowVPNAlert(true);
        } else {
          console.error("GeoIP error:", (error as Error)?.message);
        }
      }
    }

    checkCountry();
  }, []);

  return showVPNAlert;
};
