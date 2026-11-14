# Remove collections

## Decisions

- **Collections go from the app, the backend and the database.** That covers the "Other collections" Explore tab, the collection screen, the `/collections` endpoints, the weekly sync and the `collections` and `collection_items` tables.
- **The mobile app ships first, as an OTA update.** Older app versions call `/collections` from the "Other collections" tab, so the backend keeps the endpoints until most users have the update.
- **Explore shows `EmptyState` when the backend sends no tabs.** Before, the screen fell back to the collections tab.
- **The `collection_clicked` PostHog event is removed**, along with its row in the Notion table "🐾 Tracking Event - Posthog".
