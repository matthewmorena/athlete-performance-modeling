
# Track Exchange

**Track Exchange** is a web application intended to create an ELO ranking system for collegiate cross country and track & field and translate results into a simulated stock market.
Users can "trade" athlete stocks whose prices change based on performance-driven ELO-style ratings, derived from publicly available results on [TFRRS.org](https://tfrrs.org).

---

## Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [FastAPI Microservice](#fastapi-microservice)
* [Express.js Backend](#expressjs-backend)
* [Frontend (Next.js)](#frontend-nextjs)
* [Setup](#setup)
* [Roadmap](#roadmap)
* [Inspiration](#inspiration)
* [Disclaimer](#disclaimer)

---

## Overview

Track Exchange consists of three core components working together:

1. **FastAPI Microservice** – A makeshift API for scraping and exposing TFRRS data.
2. **Express.js Backend** – Middleware between the frontend, API, and database, handling caching and data freshness.
3. **Next.js Frontend** – Interactive interface where users can view rankings, trends, and trade athlete stocks.

---

## Architecture

```
Frontend (Next.js) ---> Backend (Express.js:) ---> TFRRS Scraper (FastAPI Service) ---> TFRRS.org (Unofficial source)
```

---

## FastAPI Microservice

This service scrapes and structures data from [TFRRS.org](https://tfrrs.org), providing RESTful JSON endpoints.

Vist https://github.com/matthewmorena/tfrrs-scraper for more information.

**Status:** Implemented and serving JSON
**Tech Stack:** FastAPI, BeautifulSoup, Requests, Uvicorn

---

## Express.js Backend

Acts as the middle layer between the frontend, FastAPI service, and database.
Implements caching to minimize repeated scraping and ensure data freshness.

**Status:** In progress (currently forwards API responses)
**Tech Stack:** Node.js, Express, PostgreSQL

---

## Frontend (Next.js)

The frontend will serve as the interactive interface for exploring meets, athletes, and trends.
It will eventually include trading functionality and leaderboards.

**Planned Features**

* Search for athletes, meets, and teams
* View ELO ratings and performance history
* Trade athlete stocks based on ELO changes
* Leaderboards for top users

**Status:** Under development
**Tech Stack:** Next.js, React, TailwindCSS

---

## Roadmap

| Task                                              | Status       |
| ---------------------------------------------     | -------------|
| Implement TFRRS scraping API (FastAPI)            | Complete     |
| Add caching & hashing logic (Express backend)     | In progress  |
| Build initial Next.js interface                   | In progress  |
| Integrate database (PostgreSQL)                   | Planned      |
| Implement ELO computation model                   | Planned      |
| Add trading simulation mechanics                  | Planned      |
| Deploy to production (Render / Vercel)            | Planned      |

---

## Inspiration

Track Exchange draws inspiration from:

* [TFRRS.org](https://tfrrs.org)
* [FiveThirtyEight ELO models](https://fivethirtyeight.com/features/how-our-nfl-predictions-work/)
* Fantasy trading and prediction platforms

---

## Disclaimer

Track Exchange is **not affiliated with TFRRS.org** or any NCAA organization.
All data is publicly available and used for educational and entertainment purposes only.
