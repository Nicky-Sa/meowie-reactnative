import fs from "fs";
import { rawPrimitives, rawVariables } from "./input";

type NestedObject = {
  [key: string]: NestedObject | string;
};

export const primitivesProcessor = (rawPrimitives: string) => {
  return rawPrimitives
    .replaceAll("--", "")
    .replaceAll(",", ".")
    .replaceAll(";", "")
    .split("\n")
    .filter((item) => item.length > 1)
    .map((item) => {
      const [key, value] = item.split(": ");
      return {
        key: key.split("-"),
        value,
      };
    })
    .reduce((acc: NestedObject, { key, value }) => {
      key.reduce((obj, k, i) => {
        if (i === key.length - 1) {
          // last member of the keys
          obj[k] = value;
        } else {
          obj[k] = obj[k] || {};
        }
        return obj[k] as NestedObject;
      }, acc);
      return acc;
    }, {});
};

export const variablesProcessor = (
  primitives: NestedObject,
  rawVariables: string,
) => {
  const initialVariables = rawVariables
    .replaceAll("--", "")
    .replaceAll(",", ".")
    .replaceAll(";", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("var", "")
    .split("\n")
    .filter((item) => item.length > 1)
    .map((item) => {
      const [key, value] = item.split(": ");
      return {
        key: key.split("-"),
        value,
      };
    })
    .reduce((acc: NestedObject, { key, value }) => {
      key.reduce((obj, k, i) => {
        if (i === key.length - 1) {
          // last member of the keys
          obj[k] = `primitives${value
            .split("-")
            .map((key) => `['${key}']`)
            .join("")}`;
        } else {
          obj[k] = obj[k] || {};
        }
        return obj[k] as NestedObject;
      }, acc);
      return acc;
    }, {});
  initialVariables["fontSize"] = (primitives["typography"] as NestedObject)[
    "size"
  ];
  initialVariables["fontWeight"] = (primitives["typography"] as NestedObject)[
    "weight"
  ];
  return initialVariables;
};

const primitives = primitivesProcessor(rawPrimitives);
const variables = variablesProcessor(primitives, rawVariables);

fs.writeFileSync(
  "./figma/output.ts",
  `const primitives = ${JSON.stringify(primitives, null, 2)}
   const variables = ${JSON.stringify(variables, null, 2).replaceAll('"primitives', "primitives").replaceAll(']"', "]").replaceAll("bg", "backgroundColor").replaceAll("text", "textColor").replaceAll("border", "borderColor").replaceAll("rounded", "borderRadius")}
    `,
  "utf-8",
);

console.log(JSON.stringify(variables, null, 2));
