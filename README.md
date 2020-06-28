<h1 align="center">
    Jupiter Core (EasyDMFollowers)
</h1>

<p align="center">
  <a href="https://github.com/vbisrikkanth/easydmfollowers/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Jupiter Core is released under the MIT license." /></a>
  <a href="https://badge.fury.io/js/edmf-core"><img src="https://badge.fury.io/js/edmf-core.svg" alt="npm version"></a>
  <a href="https://github.com/vbisrikkanth/easydmfollowers/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
  <a href="https://twitter.com/intent/follow?screen_name=jupiter_edmf"><img src="https://img.shields.io/twitter/follow/jupiter_edmf.svg?label=Follow%20@jupiter_edmf" alt="Follow @jupiter_edmf" /></a>
</p>

<h4 align="center">
    Contributors
</h4>
<p align="center">
  <a href="https://github.com/vbisrikkanth">
    <img src="https://github.com/vbisrikkanth.png?size=50">
  </a>
  <a href="https://github.com/lelouch77">
    <img src="https://github.com/lelouch77.png?size=50">
  </a>
  <a href="https://github.com/akshayr96">
    <img src="https://github.com/akshayr96.png?size=50">
  </a>
  <a href="https://github.com/kgkrishnavbi">
    <img src="https://github.com/kgkrishnavbi.png?size=50">
  </a>
</p>

## Contents

- [Introduction](#-introduction)
- [Background](#-background)
- [Architecture](#-architecture)
- [Usage](#-usage)
- [License](#-license)

## 🎉 Introduction

__Jupiter Core (EasyDMFollowers)__ is a set of library functions that can be used to fetch a list your followers from Twitter using [Twitter API](https://developer.twitter.com/en), segment them into lists based on their popularity (followers count, tweets count, location, etc) and send targeted Mass DMs to them by creating and tracking campaigns. 

Jupiter Core is available as an NPM package which means you can include it in your app built for any platform or web app.

## 💡 Background

The inspiration for this library came from the bounty contest [here](https://github.com/balajis/twitter-export) hosted by [@balajiS](https://twitter.com/balajis/status/1272199847324471298?s=08). We built this tool to submit our entry to the bounty contest.

## 🧱 Architecture

![Jupiter Core and UI Architecture](architecture.png?raw=true "Jupiter Core and UI Architecture")

A decoupled architecture where we have an adapter for a given social media platform (Twitter) and connection to external databases through Sequelize ORM enables us to have flexibility with the DB engine used. 

__Benefits of this Architecture:__
- Any database supported by Sequelize can be used
- Adapters for other social media platforms can be easily developed
- This library shared as an NPM package can be imported to build a native Windows/MacOS app or can be extended into a server with Express or Hapi to be further used by front-end webapps built on React, Angular, etc.


## ⚙️ Usage

##### Requirements
Twitter API keys with access permission set to 'Read, write and Direct Messages'. You can register for a twitter developer account [here](https://developer.twitter.com/)

##### Setup
1. Clone this repository into your local system 
2. Perform `npm i`
3. Copy database file from `./archive/db/jupiter.sqlite` to the root folder
4. Add Twitter API keys in the placeholders within `test.js` file in the root folder
5. Run `npm run gulp`
7. Run `node dist/test.js`
7. _[Optional]_ run `npx sequelize db:migrate` after initializing a db in sqlite to get the tables and associations mapped into your fresh database

##### Where to get started?

The [test.js](src/test.js) file in the `src` folder contains test cases for all the methods exposed in the library. To look further into how the methods are defined you can look into the [index.js](src/index.js) file in the same folder.

Alternatively, you can clone our Jupiter GUI application from its repository [here](https://github.com/lelouch77/edmf-ui-v2) and follow the setup process and test the app. Jupiter Core will be included by default as a package dependency in the GUI app.

## 📄 License

__Jupiter Core__ is MIT Licensed, as found in the [LICENSE](blob/master/LICENSE) file.