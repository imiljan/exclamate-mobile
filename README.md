# exclamate-mobile

Twitter-like mobile application build with Ionic4, Angular and ApolloClient that consumes GraphQL backend.
This project is for trying out Ionic 4 with Angular and GraphQL in a real-world application.

## Table of Contents

- [Getting Started](#getting-started)
- [Deploying](#deploying)
  - [Android](#android)
  - [iOS](#ios)

## Getting Started

- [Download the installer](https://nodejs.org/) for Node.js.
- Install the ionic CLI globally: `npm install -g ionic`
- Run `npm install` from the project root.
- Run `ionic serve` in a terminal from the project root.

## Deploying

### Android

```bash
ionic build
ionic capacitor add android
ionic capacitor open android
```

### iOS

```bash
ionic build
ionic capacitor add ios
ionic capacitor open ios
```
