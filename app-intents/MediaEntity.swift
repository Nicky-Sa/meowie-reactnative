import AppIntents

struct MediaEntity: AppEntity {
  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Movie or Series"
  static let defaultQuery = MediaQuery()

  /// Built as "movie:438631" or "series:1399", because TMDB ids repeat across movies and series.
  var id: String
  var tmdbId: Int
  var mediaType: String
  var title: String
  var year: String?

  var displayRepresentation: DisplayRepresentation {
    let kind = mediaType == "series" ? "Series" : "Movie"
    let subtitle = year.map { "\(kind) · \($0)" } ?? kind
    return DisplayRepresentation(title: "\(title)", subtitle: "\(subtitle)")
  }

  init(tmdbId: Int, mediaType: String, title: String, year: String?) {
    self.id = "\(mediaType):\(tmdbId)"
    self.tmdbId = tmdbId
    self.mediaType = mediaType
    self.title = title
    self.year = year
  }
}
