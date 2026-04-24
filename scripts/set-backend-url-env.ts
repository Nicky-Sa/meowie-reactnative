import * as os from "os";
import * as fs from "fs";
import * as path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

const getLocalIp = (): string => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    if (addresses) {
      for (const addr of addresses) {
        if (addr.family === "IPv4" && !addr.internal) {
          return addr.address;
        }
      }
    }
  }
  return "localhost";
};

const updateEnv = () => {
  const ip = getLocalIp();
  const key = "EXPO_PUBLIC_BACKEND_URL";
  const newValue = `${key}=http://${ip}:5005`;

  let content = "";

  if (fs.existsSync(ENV_PATH)) {
    // Read existing file and filter out the old backend URL line
    content = fs
      .readFileSync(ENV_PATH, "utf8")
      .split("\n")
      .filter((line) => !line.startsWith(`${key}=`))
      .join("\n")
      .trim();
  }

  // Append the new value to the cleaned content
  const updatedContent = content
    ? `${content}\n${newValue}\n`
    : `${newValue}\n`;

  fs.writeFileSync(ENV_PATH, updatedContent);
  console.log(`✅ ${key} set to: http://${ip}:5005`);
};

updateEnv();
