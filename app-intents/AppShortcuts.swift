import AppIntents

struct AppShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: SaveMediaIntent(),
      phrases: ["Save a movie in \(.applicationName)"],
      shortTitle: "Save Movie",
      systemImageName: "bookmark"
    )
  }
}
