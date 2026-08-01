export type StepHeader = { title: string; step: number };

// Every question shares progress step 3, so the bar doesn't jump while the
// user works through them.
export const stepHeaderForPath = (
  pathname: string,
  questionCount: number,
): StepHeader => {
  const rest = pathname.replace(/^\/taste\/?/, "");

  if (rest.startsWith("questions")) {
    const order = Number(rest.split("/")[1]) || 1;
    return { title: `Question ${order}/${questionCount}`, step: 3 };
  }

  switch (rest) {
    case "":
      return { title: "Rate at least 5 movies", step: 1 };
    case "series":
      return { title: "Rate a few series (optional)", step: 2 };
    case "preferences":
      return { title: "Other preferences", step: 4 };
    default:
      return { title: "", step: 1 };
  }
};
