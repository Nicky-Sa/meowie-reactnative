type StepHeader = { title: string; step: number; totalSteps: number };

// The journey's own screens, in order — the reveal sits outside them and shows
// no progress bar.
const TOTAL_STEPS = 4;

const header = (title: string, step: number): StepHeader => ({
  title,
  step,
  totalSteps: TOTAL_STEPS,
});

// Every question shares progress step 3, so the bar doesn't jump while the
// user works through them.
export const stepHeaderForPath = (
  pathname: string,
  questionCount: number,
  minMoviesToRate: number | undefined,
): StepHeader => {
  const rest = pathname.replace(/^\/taste\/?/, "");

  if (rest.startsWith("questions")) {
    const order = Number(rest.split("/")[1]) || 1;
    return header(`Question ${order}/${questionCount}`, 3);
  }

  switch (rest) {
    case "":
      // The journey payload carries the minimum, so until it lands the title
      // names no number.
      return header(
        minMoviesToRate
          ? `Rate at least ${minMoviesToRate} movies`
          : "Rate movies",
        1,
      );
    case "series":
      return header("Rate a few series (optional)", 2);
    case "preferences":
      return header("Other preferences", 4);
    default:
      return header("", 1);
  }
};
