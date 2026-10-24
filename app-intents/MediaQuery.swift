import AppIntents
import Foundation

struct MediaQuery: EntityStringQuery {
  func entities(matching string: String) async throws -> [MediaEntity] {
    let found = try await searchMedia(query: string)
    await FoundMediaStore.shared.add(found)
    return found
  }

  // Saved shortcuts keep only the id, so titles not found in this app session are loaded again.
  func entities(for identifiers: [String]) async throws -> [MediaEntity] {
    var entities: [MediaEntity] = []
    for identifier in identifiers {
      if let found = await FoundMediaStore.shared.entity(for: identifier) {
        entities.append(found)
      } else if let loaded = try await loadMedia(identifier: identifier) {
        await FoundMediaStore.shared.add([loaded])
        entities.append(loaded)
      }
    }
    return entities
  }
}

private actor FoundMediaStore {
  static let shared = FoundMediaStore()

  private var entitiesById: [String: MediaEntity] = [:]

  func add(_ entities: [MediaEntity]) {
    for entity in entities {
      entitiesById[entity.id] = entity
    }
  }

  func entity(for identifier: String) -> MediaEntity? {
    entitiesById[identifier]
  }
}

private struct BackendResponse<Content: Decodable>: Decodable {
  let data: Content
}

private struct SearchData: Decodable {
  let results: [SearchResult]
}

// People and genres come back in the same list, so every field except mediaType is optional.
private struct SearchResult: Decodable {
  let id: Int?
  let mediaType: String
  let title: String?
  let releaseYear: String?
  let firstAirDate: String?
  let posterPath: String?
}

private struct MediaDetails: Decodable {
  let title: String
  let screeningStatus: String?
  let airingYears: String?
  let posterPath: String?
}

private enum BackendError: Error {
  case missingBackendUrl
  case badResponse
}

private func getFromBackend<Content: Decodable>(
  path: String,
  queryItems: [URLQueryItem] = []
) async throws -> Content {
  guard
    let backendUrl = Bundle.main.object(forInfoDictionaryKey: "MeowieBackendUrl") as? String,
    var components = URLComponents(string: "\(backendUrl)/v1\(path)")
  else {
    throw BackendError.missingBackendUrl
  }
  if !queryItems.isEmpty {
    components.queryItems = queryItems
  }
  guard let url = components.url else {
    throw BackendError.missingBackendUrl
  }

  let (body, response) = try await URLSession.shared.data(from: url)
  guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
    throw BackendError.badResponse
  }
  return try JSONDecoder().decode(BackendResponse<Content>.self, from: body).data
}

private func searchMedia(query: String) async throws -> [MediaEntity] {
  let searchData: SearchData = try await getFromBackend(
    path: "/search/multi",
    queryItems: [URLQueryItem(name: "query", value: query)]
  )
  return searchData.results.compactMap { result in
    guard
      result.mediaType == "movie" || result.mediaType == "series",
      let tmdbId = result.id,
      let title = result.title
    else {
      return nil
    }
    let year = result.mediaType == "movie" ? result.releaseYear : result.firstAirDate
    return MediaEntity(
      tmdbId: tmdbId,
      mediaType: result.mediaType,
      title: title,
      year: year,
      posterPath: result.posterPath
    )
  }
}

private func loadMedia(identifier: String) async throws -> MediaEntity? {
  let parts = identifier.split(separator: ":")
  guard
    parts.count == 2,
    parts[0] == "movie" || parts[0] == "series",
    let tmdbId = Int(parts[1])
  else {
    return nil
  }
  let mediaType = String(parts[0])

  let details: MediaDetails = try await getFromBackend(path: "/\(mediaType)/\(tmdbId)")
  let year = mediaType == "movie" ? details.screeningStatus : details.airingYears
  return MediaEntity(
    tmdbId: tmdbId,
    mediaType: mediaType,
    title: details.title,
    year: year,
    posterPath: details.posterPath
  )
}
