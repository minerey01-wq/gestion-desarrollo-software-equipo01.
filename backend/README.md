# Control de Visitas Móvil

## Descripción
Aplicación móvil Android conectada a una API REST
desarrollada con Node.js y Express.

Redis almacena el contador de visitas y Docker
permite ejecutar los servicios de manera independiente.

## Tecnologías
- Android Studio
- Kotlin
- Node.js
- Express
- Redis
- Docker
- GitHub Actions

## Requisitos
- Node.js 20
- npm
- Docker
- Android Studio
- Git

## Ejecutar el backend

Entrar a la carpeta backend:

cd backend

Instalar dependencias:

npm install

Ejecutar pruebas:

npm test

## Ejecutar con Docker

Desde la raíz del proyecto:

docker compose up --build -d

## Consultar el servidor

http://localhost:3000/health

## Consultar visitas

http://localhost:3000/api/visitas

## Detener servicios

docker compose down

## Dirección para el emulador Android

http://10.0.2.2:3000

## Integrantes
Agregar los nombres de los integrantes del equipo.