---
layout: news
title: Dataset Milestones - 11,000+ Breweries, New Site Features, and API v1.1.0
description: "The homepage got a refresh, featuring a new 'Browse Breweries by Country' view. Plus, API v1.1.0 shipped with automated Scribe docs and Laravel updates."
date: 2026-06-05T12:00:00-07:00
authors: ['chrisjm']
---

Heya, all! It's been a minute. Marketing updates aren't exactly my superpower, but we have some massive milestones and updates to share. 😅

Let's dive right into what's new. 🍻

## 🌐 New Website Features: Browse by Country

The homepage got a refresh and there's now a "Browse Breweries" page where you can explore the dataset by country. It's powered by a new `by_country` aggregation on the `/breweries/meta` endpoint.

- 🔗 [Check out the Homepage](https://www.openbrewerydb.org)
- 🔗 [Explore by country](https://www.openbrewerydb.org/breweries/browse)

## 📊 Milestone: We Crossed 11,000 Breweries!

We didn't just cross the 10,000 mark—we blew right past it. The dataset now tracks **11,744 breweries across 23 countries**.

A massive shoutout to the community for expanding our international coverage:

- [@simonmackinnon](https://github.com/simonmackinnon) contributed ~1,440 German breweries ([#268](https://github.com/openbrewerydb/openbrewerydb/pull/268)), followed by scrapes for Belgium and New Zealand ([#270](https://github.com/openbrewerydb/openbrewerydb/pull/270)).
- [@kpomer](https://github.com/kpomer) added 68 breweries from Finland ([#250](https://github.com/openbrewerydb/openbrewerydb/pull/250)).
- [@lglasbergen](https://github.com/lglasbergen) added 81 breweries from the Netherlands ([#248](https://github.com/openbrewerydb/openbrewerydb/pull/248)).
- Plus, ongoing state-level audits keep cleaning up and validating US data.

This project only grows because of your efforts. Seriously, thank you! 🍻

- 🔗 [Dataset](https://github.com/openbrewerydb/openbrewerydb)

## ✨ API v1.1.0 Shipped

The backend just got a solid upgrade to Laravel v13. More importantly, we now have automated OpenAPI documentation via Scribe. They are auto-generated straight from the Laravel code, meaning our docs will finally stay perfectly in sync with the codebase.

Huge thanks to [@gregwilson42](https://github.com/gregwilson42) for leading the charge on the Scribe integration ([#122](https://github.com/openbrewerydb/openbrewerydb-laravel-api/pull/122)). The docs are live but still getting a bit of polish.

And also a big thank you to [@alexjustesen](https://github.com/alexjustesen) for the Laravel v13 upgrade and keeping the API healthy.

- 🔗 [Scribe API docs](https://api.openbrewerydb.org/docs)
- 🔗 [Release notes](https://github.com/openbrewerydb/openbrewerydb-laravel-api/releases/tag/v1.1.0)

## 👏 Contributor round-up

OpenBreweryDB runs entirely on volunteer effort. Huge thanks to everyone pushing the data and the code forward:

- [@alexjustesen](https://github.com/alexjustesen) — CT audits, MA additions, Laravel v13 upgrade
- [@simonmackinnon](https://github.com/simonmackinnon) — Germany, Belgium, and New Zealand international data
- [@natebru](https://github.com/natebru) — WA additions & closures
- [@kpomer](https://github.com/kpomer) — Finland dataset
- [@lglasbergen](https://github.com/lglasbergen) — Netherlands dataset
- [@CrepuscularCremini](https://github.com/CrepuscularCremini) — Ontario updates
- [@gregwilson42](https://github.com/gregwilson42) — Scribe API docs
- [@jallend1](https://github.com/jallend1), [@donkeyslaps](https://github.com/donkeyslaps), [@mikeputnam](https://github.com/mikeputnam), [@AndrewBarber](https://github.com/AndrewBarber) — Steady, continuous dataset curation

...and everyone else who filed an issue, opened a PR, or suggested a fix. Every single brewery counts!

> **Note:** If you’ve contributed and don't see your name under the [Contributors section](https://www.openbrewerydb.org#contributors-title) on the homepage, please reach out so we can make sure you're properly credited!

## 🍻 Get Involved

Want to help out or just hang out with the community?

- **Add data:** If your favorite local spot is missing, check out our [Contributing Guidelines](https://github.com/openbrewerydb/openbrewerydb/blob/master/CONTRIBUTING.md) and submit a PR.
- **Join the chat:** Connect with us on [Discord](https://discord.gg/3G3syaD) or follow along on [Bluesky](https://bsky.app/profile/openbrewerydb.org) and [GitHub](https://github.com/openbrewerydb).

Cheers! 🍻
