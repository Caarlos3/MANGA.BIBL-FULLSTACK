package com.caarlos.mangalibrary.model;

import jakarta.persistence.*;

@Entity
@Table(name = "manga_leidos")
public class MangaLeidos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Long malId;

    private String title;
    private String imageUrl;

    @Column(length = 2000)
    private String synopsis;

    private Double score;

    @Column(length = 1000)
    private String genres;

    @Column(length = 500)
    private String authors;

    private Integer publishedYear;

    public MangaLeidos() {}

    public MangaLeidos(String userEmail, Manga manga) {
        this.userEmail = userEmail;
        this.malId = manga.getMalId();
        this.title = manga.getTitle();
        this.imageUrl = manga.getImageUrl();
        this.synopsis = manga.getSynopsis();
        this.score = manga.getScore();
        this.publishedYear = manga.getPublishedYear();

        if (manga.getGenres() != null && !manga.getGenres().isEmpty()) {
            this.genres = String.join(",", manga.getGenres());
        }
        if (manga.getAuthors() != null && !manga.getAuthors().isEmpty()) {
            this.authors = String.join(",", manga.getAuthors());
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getMalId() {
        return malId;
    }

    public void setMalId(Long malId) {
        this.malId = malId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public Integer getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(Integer publishedYear) {
        this.publishedYear = publishedYear;
    }
}