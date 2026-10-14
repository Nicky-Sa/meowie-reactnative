type StepHeader = { title: string; step: number; totalSteps: number };

// The saving screen sits outside the journey and shows no progress bar.
const TOTAL_STEPS = 3;

const header = (title: string, step: number): StepHeader => ({
  title,
  step,
  totalSteps: TOTAL_STEPS,
});

export const stepHeaderForPath = (
  pathname: string,
  minMoviesToLike: number | undefined,
): StepHeader => {
  const rest = pathname.replace(/^\/taste\/?/, "");

  switch (rest) {
    case "":
      // The journey payload carries the minimum, so until it lands the title
      // names no number.
      return header(
        minMoviesToLike
          ? `Like at least ${minMoviesToLike} movies`
          : "Rate movies",
        1,
      );
    case "series":
      return header("Rate a few series (optional)", 2);
    case "preferences":
      return header("Avoid", 3);
    default:
      return header("", 1);
  }
};
