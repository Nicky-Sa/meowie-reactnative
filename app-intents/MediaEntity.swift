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
  var posterUrl: URL?

  var displayRepresentation: DisplayRepresentation {
    let kind = mediaType == "series" ? "Series" : "Movie"
    let subtitle = year.map { "\(kind) · \($0)" } ?? kind
    return DisplayRepresentation(
      title: "\(title)",
      subtitle: "\(subtitle)",
      // Same size as the posters on the app's search screen.
      image: posterUrl.map { DisplayRepresentation.Image(url: $0, width: 48, height: 72) }
    )
  }

  init(tmdbId: Int, mediaType: String, title: String, year: String?, posterPath: String?) {
    self.id = "\(mediaType):\(tmdbId)"
    self.tmdbId = tmdbId
    self.mediaType = mediaType
    self.title = title
    self.year = year
    self.posterUrl = posterPath.flatMap { URL(string: $0) }
  }
}
