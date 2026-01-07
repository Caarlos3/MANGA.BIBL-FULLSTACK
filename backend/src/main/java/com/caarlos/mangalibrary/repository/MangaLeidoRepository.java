package com.caarlos.mangalibrary.repository;

import com.caarlos.mangalibrary.model.MangaLeidos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MangaLeidoRepository extends JpaRepository<MangaLeidos, Long> {

    List<MangaLeidos> findByUserEmail(String userEmail);

    Optional<MangaLeidos> findByUserEmailAndMalId(String userEmail, Long malId);

    void deleteByUserEmailAndMalId(String userEmail, Long malId);
}