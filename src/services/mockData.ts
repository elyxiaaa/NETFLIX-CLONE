/**
 * Mock catalog — shaped exactly like TMDB `Movie` objects.
 *
 * Every `poster_path` / `backdrop_path` below is a REAL TMDB CDN path, validated
 * against `image.tmdb.org` so the UI looks authentic with no API key. A few
 * documentary entries intentionally have `null` art to exercise the graceful
 * gradient fallback (and they'll fill in automatically once live TMDB is wired).
 *
 * `MOCK_ROWS` is keyed by the same endpoint paths declared in `api.ts` (`requests`),
 * so `getRow(fetchUrl)` can resolve a dataset with a direct lookup. Swapping to
 * live TMDB changes nothing here — the shapes already match.
 */
import type { Movie } from "../types/movie";
import { requests } from "./api";

export const CATALOG: Movie[] = [
  {
    id: 66732,
    title: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdrop_path: "/2MaumbgBlW1NoPo3ZJO38A6v7OS.jpg",
    overview:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    release_date: "2016-07-15",
    vote_average: 8.6,
    genre_ids: [18, 10765, 9648],
  },
  {
    id: 71912,
    title: "The Witcher",
    poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    backdrop_path: "/jBJWaqoSCiARWtfV0GlqHrcdidd.jpg",
    overview:
      "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    release_date: "2019-12-20",
    vote_average: 8.0,
    genre_ids: [10765, 18, 10759],
  },
  {
    id: 71446,
    title: "Money Heist",
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    backdrop_path: "/gFZriCkpJYsApPZEF3jhxL4yLzG.jpg",
    overview:
      "A mysterious man known as The Professor recruits a band of eight thieves for the biggest heist in recorded history — the Royal Mint of Spain.",
    release_date: "2017-05-02",
    vote_average: 8.2,
    genre_ids: [80, 18],
  },
  {
    id: 87739,
    title: "The Queen's Gambit",
    poster_path: "/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
    backdrop_path: "/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg",
    overview:
      "In a 1950s orphanage, a young girl discovers an astonishing talent for chess while grappling with addiction on her rise to the top of the game.",
    release_date: "2020-10-23",
    vote_average: 8.3,
    genre_ids: [18],
  },
  {
    id: 119051,
    title: "Wednesday",
    poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    overview:
      "Wednesday Addams investigates a monstrous killing spree at Nevermore Academy while navigating new friendships — and a few deadly enemies.",
    release_date: "2022-11-23",
    vote_average: 8.5,
    genre_ids: [10765, 35, 9648],
  },
  {
    id: 93405,
    title: "Squid Game",
    poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    backdrop_path: "/qw3J9cNeLioOLoR68WX7z79aCdK.jpg",
    overview:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games with tempting prizes — and deadly high stakes.",
    release_date: "2021-09-17",
    vote_average: 7.8,
    genre_ids: [10759, 9648, 18],
  },
  {
    id: 82856,
    title: "The Mandalorian",
    poster_path: "/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
    backdrop_path: "/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    overview:
      "A lone bounty hunter journeys through the outer reaches of the galaxy, far from the authority of the New Republic.",
    release_date: "2019-11-12",
    vote_average: 8.4,
    genre_ids: [10765, 10759, 37],
  },
  {
    id: 1396,
    title: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    overview:
      "A high-school chemistry teacher diagnosed with cancer teams with a former student to secure his family's future by manufacturing and selling crystal meth.",
    release_date: "2008-01-20",
    vote_average: 8.9,
    genre_ids: [18, 80],
  },
  {
    id: 60574,
    title: "Peaky Blinders",
    poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdrop_path: "/q8eejQcg1bAqImEV8jh8RtBD4uH.jpg",
    overview:
      "A gangster family epic set in 1919 Birmingham: the fierce Shelby crime family sews razor blades into the peaks of their caps as they rise through the ranks.",
    release_date: "2013-09-12",
    vote_average: 8.5,
    genre_ids: [80, 18],
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    overview:
      "When the menace known as the Joker throws Gotham into anarchy, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genre_ids: [18, 28, 80, 53],
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    release_date: "2010-07-15",
    vote_average: 8.4,
    genre_ids: [28, 878, 12],
  },
  {
    id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    release_date: "2014-11-05",
    vote_average: 8.4,
    genre_ids: [12, 18, 878],
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    overview:
      "After the devastating events of Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos' actions and restore balance.",
    release_date: "2019-04-24",
    vote_average: 8.3,
    genre_ids: [12, 878, 28],
  },
  {
    id: 475557,
    title: "Joker",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdrop_path: "/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    overview:
      "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
    release_date: "2019-10-02",
    vote_average: 8.1,
    genre_ids: [80, 53, 18],
  },
  {
    id: 496243,
    title: "Parasite",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks, until they get entangled in an unexpected incident.",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genre_ids: [35, 53, 18],
  },
  {
    id: 438631,
    title: "Dune",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
    overview:
      "Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    release_date: "2021-09-15",
    vote_average: 7.8,
    genre_ids: [878, 12],
  },
  {
    id: 414906,
    title: "The Batman",
    poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    overview:
      "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    release_date: "2022-03-01",
    vote_average: 7.7,
    genre_ids: [80, 53, 18],
  },
  {
    id: 361743,
    title: "Top Gun: Maverick",
    poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    overview:
      "After more than thirty years of service as one of the Navy's top aviators, Pete 'Maverick' Mitchell trains a detachment of Top Gun graduates for a specialized mission.",
    release_date: "2022-05-24",
    vote_average: 8.2,
    genre_ids: [28, 18],
  },
  {
    id: 872585,
    title: "Oppenheimer",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II — and the reckoning that followed.",
    release_date: "2023-07-19",
    vote_average: 8.1,
    genre_ids: [18, 36],
  },
  {
    id: 244786,
    title: "Whiplash",
    poster_path: "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdrop_path: "/6uLhSLXzB1ooJ3522ydrBZ2Hh0W.jpg",
    overview:
      "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost — even his humanity.",
    release_date: "2014-10-10",
    vote_average: 8.4,
    genre_ids: [18, 10402],
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison and forms a lasting friendship.",
    release_date: "1994-09-23",
    vote_average: 8.7,
    genre_ids: [18, 80],
  },
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    overview:
      "A ticking-time-bomb insomniac and a slippery soap salesman channel male aggression into a shocking new form of therapy — an underground fight club.",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genre_ids: [18],
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    overview:
      "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in three tales of violence and redemption.",
    release_date: "1994-09-10",
    vote_average: 8.5,
    genre_ids: [53, 80],
  },
  {
    id: 603,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
    overview:
      "Hacker Neo discovers that his reality is a simulation built by machines, and joins a rebellion to free humanity from the illusion of the Matrix.",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genre_ids: [28, 878],
  },
  {
    id: 634649,
    title: "Spider-Man: No Way Home",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    overview:
      "Peter Parker's secret identity is revealed. When he asks Doctor Strange for help, the stakes become even more dangerous — forcing him to discover what it truly means to be Spider-Man.",
    release_date: "2021-12-15",
    vote_average: 8.0,
    genre_ids: [28, 12, 878],
  },

  // ---- Poster-only titles (backdrop not on the CDN; rendered in poster rows) ----
  {
    id: 245891,
    title: "John Wick",
    poster_path: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    backdrop_path: null,
    overview:
      "Ex-hit-man John Wick comes out of retirement to track down the gangsters who took everything from him.",
    release_date: "2014-10-22",
    vote_average: 7.4,
    genre_ids: [28, 53],
  },
  {
    id: 106646,
    title: "The Wolf of Wall Street",
    poster_path: "/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg",
    backdrop_path: null,
    overview:
      "A New York stockbroker's meteoric rise to wealth is fueled by fraud, corruption and excess — and the federal government is closing in.",
    release_date: "2013-12-25",
    vote_average: 8.0,
    genre_ids: [80, 18, 35],
  },
  {
    id: 419430,
    title: "Get Out",
    poster_path: "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    backdrop_path: null,
    overview:
      "A young Black man visits his white girlfriend's family estate for the weekend, where his growing unease leads to a terrifying discovery.",
    release_date: "2017-02-24",
    vote_average: 7.6,
    genre_ids: [27, 9648, 53],
  },
  {
    id: 293660,
    title: "Deadpool",
    poster_path: "/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
    backdrop_path: null,
    overview:
      "A wisecracking mercenary gets experimented on and left with accelerated healing powers — and a dark, twisted sense of humor.",
    release_date: "2016-02-09",
    vote_average: 7.6,
    genre_ids: [28, 12, 35],
  },
  {
    id: 8363,
    title: "Superbad",
    poster_path: "/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
    backdrop_path: null,
    overview:
      "Two co-dependent high-school friends set out to score alcohol for a party, hoping it will finally win them popularity before graduation.",
    release_date: "2007-08-17",
    vote_average: 7.2,
    genre_ids: [35],
  },
  {
    id: 18785,
    title: "The Hangover",
    poster_path: "/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
    backdrop_path: null,
    overview:
      "Three friends wake up from a bachelor party in Las Vegas with no memory of the previous night — and the bachelor missing.",
    release_date: "2009-06-05",
    vote_average: 7.3,
    genre_ids: [35],
  },
  {
    id: 97546,
    title: "Ted Lasso",
    poster_path: "/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg",
    backdrop_path: null,
    overview:
      "An American football coach is hired to manage an English soccer team — despite having zero experience — and wins hearts with relentless optimism.",
    release_date: "2020-08-14",
    vote_average: 8.4,
    genre_ids: [35, 18],
  },
  {
    id: 546554,
    title: "Knives Out",
    poster_path: "/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    backdrop_path: null,
    overview:
      "A renowned detective is called to investigate the death of the patriarch of an eccentric, combative family of vipers.",
    release_date: "2019-11-27",
    vote_average: 7.9,
    genre_ids: [35, 80, 9648],
  },
  {
    id: 76341,
    title: "Mad Max: Fury Road",
    poster_path: "/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    backdrop_path: null,
    overview:
      "In a post-apocalyptic wasteland, Max joins forces with Furiosa to flee a tyrant across the desert in an armored war rig.",
    release_date: "2015-05-13",
    vote_average: 7.6,
    genre_ids: [28, 12, 878],
  },

  // ---- Documentaries ----
  {
    id: 515001,
    title: "Free Solo",
    poster_path: "/wKiOkZTN9lUUUNZLmtnwubZYONg.jpg",
    backdrop_path: null,
    overview:
      "Climber Alex Honnold prepares to achieve his lifelong dream: scaling the 3,000-foot El Capitan in Yosemite without a rope.",
    release_date: "2018-09-28",
    vote_average: 7.9,
    genre_ids: [99],
  },
  {
    id: 705996,
    title: "My Octopus Teacher",
    poster_path: "/zI8KZ4EdLUymWKX1YEkpZ0gtPUa.jpg",
    backdrop_path: null,
    overview:
      "A filmmaker forges an unusual and life-changing friendship with an octopus living in a South African kelp forest.",
    release_date: "2020-09-07",
    vote_average: 8.1,
    genre_ids: [99],
  },
  {
    id: 393404,
    title: "13th",
    poster_path: "/dpGVSCvxw4ptuIil0TfMhZhy71O.jpg",
    backdrop_path: null,
    overview:
      "An in-depth, powerful look at the U.S. prison system and the way it reveals the nation's history of racial inequality.",
    release_date: "2016-10-07",
    vote_average: 7.9,
    genre_ids: [99],
  },
  // These docs have no CDN art on hand — they demonstrate the gradient fallback,
  // and populate automatically when live TMDB is enabled.
  {
    id: 85520,
    title: "Our Planet",
    poster_path: null,
    backdrop_path: null,
    overview:
      "Experience the planet's natural beauty and examine how climate change impacts all living creatures in this ambitious documentary of spectacular scope.",
    release_date: "2019-04-05",
    vote_average: 8.5,
    genre_ids: [99, 18],
  },
  {
    id: 664219,
    title: "The Social Dilemma",
    poster_path: null,
    backdrop_path: null,
    overview:
      "Tech experts sound the alarm on the dangerous human impact of social networking, the very technology they helped build.",
    release_date: "2020-01-26",
    vote_average: 7.6,
    genre_ids: [99],
  },
  {
    id: 570472,
    title: "Apollo 11",
    poster_path: null,
    backdrop_path: null,
    overview:
      "A look at the Apollo 11 mission to land on the moon, assembled entirely from restored archival footage and audio, much of it never before seen.",
    release_date: "2019-03-01",
    vote_average: 8.0,
    genre_ids: [99, 36],
  },
];

/** Fast id → Movie lookup used to compose rows and resolve "similar". */
const byId: Record<number, Movie> = Object.fromEntries(
  CATALOG.map((m) => [m.id, m]),
);

/** Resolve an ordered list of ids into Movie objects (skips any unknown id). */
const pick = (...ids: number[]): Movie[] =>
  ids.map((id) => byId[id]).filter(Boolean);

/**
 * Row datasets, keyed by the endpoint paths in `api.ts` `requests`.
 * Titles intentionally overlap between rows — exactly how real streaming rows do.
 */
export const MOCK_ROWS: Record<string, Movie[]> = {
  [requests.fetchTrending]: pick(
    155, 872585, 496243, 361743, 634649, 438631, 87739, 93405, 475557, 66732,
    414906, 299534,
  ),
  [requests.fetchOriginals]: pick(
    66732, 71912, 71446, 87739, 119051, 93405, 82856, 60574, 1396,
  ),
  [requests.fetchActionMovies]: pick(
    155, 27205, 603, 634649, 361743, 299534, 438631, 245891, 76341, 414906,
  ),
  [requests.fetchSciFi]: pick(
    157336, 438631, 603, 27205, 299534, 71912, 82856, 93405, 634649,
  ),
  [requests.fetchTopRated]: pick(
    278, 550, 680, 496243, 244786, 872585, 1396, 60574,
  ),
  [requests.fetchCrime]: pick(
    475557, 680, 71446, 60574, 1396, 414906, 419430, 106646,
  ),
  [requests.fetchComedyMovies]: pick(
    293660, 8363, 18785, 97546, 546554, 106646, 119051, 496243,
  ),
  [requests.fetchDocumentaries]: pick(515001, 705996, 393404, 85520, 664219, 570472),
};
