const TOTAL_QUESTIONS = 4;

export type StepHeader = { title: string; step: number };

/**
 * Derives the shared header title and progress step from the current taste
 * route, so the wizard layout can render one persistent header + progress bar
 * for every step. The 4 taste questions live under /taste/questions/<order>
 * and all sit on progress step 4.
 *
 * Only the wizard steps appear here. /taste/result is not one of them — it has
 * no header or progress bar, which is why it sits outside the (wizard) group.
 */
export const stepHeaderForPath = (pathname: string): StepHeader => {
  const rest = pathname.replace(/^\/taste\/?/, "");

  if (rest.startsWith("questions")) {
    const order = Number(rest.split("/")[1]) || 1;
    return { title: `Question ${order}/${TOTAL_QUESTIONS}`, step: 4 };
  }

  switch (rest) {
    case "":
      return { title: "Pick movies you love", step: 1 };
    case "series":
      return { title: "Pick series you love", step: 2 };
    case "genres":
      return { title: "Confirm your genres", step: 3 };
    case "preferences":
      return { title: "Anything to avoid?", step: 5 };
    default:
      return { title: "", step: 1 };
  }
};
