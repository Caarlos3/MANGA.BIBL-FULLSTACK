package com.caarlos.mangalibrary.service;

import com.caarlos.mangalibrary.model.Manga;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class MangaApi {

    private static final String BASE_URL = "https://api.jikan.moe/v4";
    private final HttpClient httpClient;

    public MangaApi() {
        this.httpClient = HttpClient.newHttpClient();
    }

    public List<Manga> searchManga(String query) throws Exception {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = BASE_URL + "/manga?q=" + encodedQuery;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new Exception("Failed : HTTP error code : " + response.statusCode());
        }

        String responseBody = response.body();
        JsonObject json = JsonParser.parseString(responseBody).getAsJsonObject();
        JsonArray dataArray = json.getAsJsonArray("data");

        List<Manga> mangas = new ArrayList<>();

        for (int i = 0; i < dataArray.size(); i++) {
            JsonObject mangaJson = dataArray.get(i).getAsJsonObject();

            Manga manga = new Manga();
            manga.setMalId(mangaJson.get("mal_id").getAsLong());
            manga.setTitle(mangaJson.get("title").getAsString());

            if (mangaJson.has("images") && !mangaJson.get("images").isJsonNull()) {
                JsonObject images = mangaJson.getAsJsonObject("images");
                if (images.has("jpg") && !images.get("jpg").isJsonNull()) {
                    JsonObject jpg = images.getAsJsonObject("jpg");
                    if (jpg.has("image_url") && !jpg.get("image_url").isJsonNull()) {
                        manga.setImageUrl(jpg.get("image_url").getAsString());
                    }
                }
            }

            List<String> authors = new ArrayList<>();
            JsonArray authorsArray = mangaJson.getAsJsonArray("authors");
            if (authorsArray != null) {
                authorsArray.forEach(author -> authors.add(author.getAsJsonObject().get("name").getAsString()));
            }
            manga.setAuthors(authors);

            List<String> genres = new ArrayList<>();
            JsonArray genresArray = mangaJson.getAsJsonArray("genres");
            if (genresArray != null) {
                genresArray.forEach(genre -> genres.add(genre.getAsJsonObject().get("name").getAsString()));
            }
            manga.setGenres(genres);

            if (mangaJson.has("synopsis") && !mangaJson.get("synopsis").isJsonNull()) {
                manga.setSynopsis(mangaJson.get("synopsis").getAsString());
            }

            if (mangaJson.has("score") && !mangaJson.get("score").isJsonNull()) {
                manga.setScore(mangaJson.get("score").getAsDouble());
            }

            if (mangaJson.has("published") && !mangaJson.get("published").isJsonNull()) {
                JsonObject published = mangaJson.getAsJsonObject("published");
                if (published.has("prop") && !published.get("prop").isJsonNull()) {
                    JsonObject prop = published.getAsJsonObject("prop");
                    if (prop.has("from") && !prop.get("from").isJsonNull()) {
                        JsonObject from = prop.getAsJsonObject("from");
                        if (from.has("year") && !from.get("year").isJsonNull()) {
                            manga.setPublishedYear(from.get("year").getAsInt());
                        }
                    }
                }
            }
            mangas.add(manga);
        }
        return mangas;
    }
}