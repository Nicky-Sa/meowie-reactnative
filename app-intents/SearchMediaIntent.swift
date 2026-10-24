import AppIntents
internal import ExpoAppIntents

@available(iOS 27.0, *)
@AppIntent(schema: .system.searchInApp)
struct SearchMediaIntent: ShowInAppSearchResultsIntent {
  static let searchScopes: [StringSearchScope] = [.general]

  var criteria: StringSearchCriteria

  @MainActor
  func perform() async throws -> some IntentResult {
    await AppIntentDispatcher.shared.dispatch(
      name: "searchMedia",
      params: ["query": .string(criteria.term)]
    )

    return .result()
  }
}
