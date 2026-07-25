export type StepHeader = { title: string; step: number };

// Every question shares progress step 4, so the bar doesn't jump while the
// user works through them.
export const stepHeaderForPath = (
  pathname: string,
  questionCount: number,
): StepHeader => {
  const rest = pathname.replace(/^\/taste\/?/, "");

  if (rest.startsWith("questions")) {
    const order = Number(rest.split("/")[1]) || 1;
    return { title: `Question ${order}/${questionCount}`, step: 4 };
  }

  switch (rest) {
    case "":
      return { title: "Pick movies you love", step: 1 };
    case "series":
      return { title: "Pick series you love", step: 2 };
    case "genres":
      return { title: "Confirm your genres", step: 3 };
    case "preferences":
      return { title: "Other preferences", step: 5 };
    default:
      return { title: "", step: 1 };
  }
};
