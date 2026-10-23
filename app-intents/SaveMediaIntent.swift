import AppIntents
internal import ExpoAppIntents

struct SaveMediaIntent: AppIntent {
  static let title: LocalizedStringResource = "Save Movie"
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Title", requestValueDialog: "Which title?")
  var media: MediaEntity

  static var parameterSummary: some ParameterSummary {
    Summary("Save \(\.$media)")
  }

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "saveMedia",
      params: ["id": .int(media.tmdbId), "mediaType": .string(media.mediaType)]
    )

    return .result(dialog: "Opening the app to save \(media.title).")
  }
}
