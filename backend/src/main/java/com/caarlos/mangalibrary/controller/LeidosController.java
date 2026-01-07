package com.caarlos.mangalibrary.controller;

import com.caarlos.mangalibrary.model.Manga;
import com.caarlos.mangalibrary.model.MangaLeidos;
import com.caarlos.mangalibrary.repository.MangaLeidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leidos")
public class LeidosController {

    private final MangaLeidoRepository mangaLeidoRepository;

    public LeidosController(MangaLeidoRepository mangaLeidoRepository) {
        this.mangaLeidoRepository = mangaLeidoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Manga>> getLeidos(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();
        List<MangaLeidos> leidos = mangaLeidoRepository.findByUserEmail(userEmail);
        List<Manga> mangas = leidos.stream().map(this::toManga).collect(Collectors.toList());

        return ResponseEntity.ok(mangas);
    }

    @PostMapping
    public ResponseEntity<String> addLeido(@RequestBody Manga manga, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        if (manga == null || manga.getMalId() == null) {
            return ResponseEntity.badRequest().body("Falta malId");
        }

        String userEmail = authentication.getName();

        if (mangaLeidoRepository.findByUserEmailAndMalId(userEmail, manga.getMalId()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe en leídos");
        }

        MangaLeidos leido = new MangaLeidos(userEmail, manga);
        mangaLeidoRepository.save(leido);

        return ResponseEntity.status(HttpStatus.CREATED).body("Creado");
    }

    @DeleteMapping("/{malId}")
    @Transactional
    public ResponseEntity<String> removeLeido(@PathVariable Long malId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        String userEmail = authentication.getName();

        if (mangaLeidoRepository.findByUserEmailAndMalId(userEmail, malId).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No encontrado");
        }

        mangaLeidoRepository.deleteByUserEmailAndMalId(userEmail, malId);

        return ResponseEntity.noContent().build();
    }

    private Manga toManga(MangaLeidos leido) {
        Manga manga = new Manga();
        manga.setMalId(leido.getMalId());
        manga.setTitle(leido.getTitle());
        manga.setImageUrl(leido.getImageUrl());
        manga.setSynopsis(leido.getSynopsis());
        manga.setScore(leido.getScore());
        manga.setPublishedYear(leido.getPublishedYear());

        if (leido.getGenres() != null && !leido.getGenres().isEmpty()) {
            manga.setGenres(Arrays.asList(leido.getGenres().split(",")));
        } else {
            manga.setGenres(Collections.emptyList());
        }

        if (leido.getAuthors() != null && !leido.getAuthors().isEmpty()) {
            manga.setAuthors(Arrays.asList(leido.getAuthors().split(",")));
        } else {
            manga.setAuthors(Collections.emptyList());
        }

        return manga;
    }
}