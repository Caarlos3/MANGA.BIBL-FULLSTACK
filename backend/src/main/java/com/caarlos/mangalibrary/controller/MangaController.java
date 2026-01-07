package com.caarlos.mangalibrary.controller;

import com.caarlos.mangalibrary.model.Manga;
import com.caarlos.mangalibrary.service.MangaApi;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MangaController {

    private final MangaApi mangaApi;

    public MangaController(MangaApi mangaApi) {
        this.mangaApi = mangaApi;
    }

    @GetMapping("/manga")
    public List<Manga> searchManga(@RequestParam String query) throws Exception {
        return mangaApi.searchManga(query);
    }
}