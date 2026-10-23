import AppIntents
internal import ExpoAppIntents

struct SaveMediaIntent: AppIntent {
  static let title: LocalizedStringResource = "Save Movie"
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Title", requestValueDialog: "Which title?")
  var title: String

  static var parameterSummary: some ParameterSummary {
    Summary("Save \(\.$title)")
  }

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "saveMedia",
      params: ["title": .string(title)]
    )

    return .result(dialog: "Opening the app to save \(title).")
  }
}
