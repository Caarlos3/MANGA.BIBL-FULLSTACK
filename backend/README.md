# Manga-bibl Backend

Backend de la aplicación Manga-bibl desarrollado con Java 21 y Spring Boot.  
Proporciona una API RESTful para buscar mangas usando la API externa de Jikan (MyAnimeList) y gestionar datos relacionados.

## Tecnologías

- Java 21
- Spring Boot
- Maven
- Jackson (para parseo JSON)
- Spring Web (REST API)
- Configuración CORS para comunicación con frontend

## Funcionalidades

- Endpoint para buscar mangas por título, consumiendo la API de Jikan.
- Parseo y transformación de datos JSON para devolver solo la información necesaria.
- Configuración CORS para permitir peticiones desde el frontend.
- Estructura modular para fácil extensión y mantenimiento.
