export enum TourStep {
  // -------------------------
  // 1. Home / Header Tour
  // -------------------------
  HeaderToggle = 1,
  HeaderSort,

  // -------------------------
  // 2. Media Details Tour
  // -------------------------
  MediaPoster,
  MediaDirector,
  MediaGenres,
  MediaSave,
  MediaSeen,
  MediaDetails,
}

export const tourStepContent: Record<TourStep, string> = {
  [TourStep.HeaderToggle]:
    "Switch between Movies and Series to explore different content types.",
  [TourStep.HeaderSort]:
    "Use this to sort the content by popularity, newest, or other criteria.",
  [TourStep.MediaPoster]:
    "Tap on the poster to view a high-quality version and more info.",
  [TourStep.MediaDirector]:
    "Check out the director and key crew members of this movie.",
  [TourStep.MediaGenres]:
    "Explore different genres associated with this media.",
  [TourStep.MediaSave]:
    "Save this item to your library to keep track of what you want to watch.",
  [TourStep.MediaSeen]:
    "Mark this as seen once you've watched it to organize your library.",
  [TourStep.MediaDetails]: "See more details on this item here.",
};
