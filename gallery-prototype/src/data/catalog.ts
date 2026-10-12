export type Episode = { name: string; focus: string };

export type Item = {
  id: string;
  title: string;
  variant: "photo" | "event";
  kindLabel: string;
  genres: string;
  year: string;
  runtime: string;
  seconds: number;
  rating: string;
  badge?: string;
  date?: string;
  logline: string;
  cast: string;
  creditLabel: string;
  image?: string;
  focus: string;
  episodes?: Episode[];
};

export type Row = {
  id: string;
  label: string;
  variant: "ranked" | "poster" | "landscape" | "event";
  items: Item[];
};

function eps(a: string, b: string, c: string): Episode[] {
  return [
    { name: a, focus: "center 22%" },
    { name: b, focus: "center 50%" },
    { name: c, focus: "center 78%" },
  ];
}

function show(item: Omit<Item, "variant" | "creditLabel"> & { creditLabel?: string }): Item {
  return { variant: "photo", creditLabel: "Cast", ...item };
}

export const ranked: Item[] = [
  show({
    id: "southwind",
    title: "South Wind",
    kindLabel: "Series",
    genres: "Comedy · Sport",
    year: "2024",
    runtime: "32 min",
    seconds: 32 * 60,
    rating: "12+",
    badge: "All episodes",
    logline: "A retired sailing coach takes over a junior rowing crew that always finishes last. She cannot read the new tide chart, but she can turn every boat back toward itself.",
    cast: "Wan Ning, Chen Yu, Lin Xia",
    image: "/art/southwind.jpg",
    focus: "center 28%",
    episodes: eps("Episode 1 · Tryouts", "Episode 2 · First water", "Episode 3 · Night practice"),
  }),
  show({
    id: "gearstorm",
    title: "Gearstorm",
    kindLabel: "Film",
    genres: "Action · Comedy",
    year: "2026",
    runtime: "2 hr 6 min",
    seconds: 126 * 60,
    rating: "13+",
    badge: "New",
    logline: "A weekend reunion turns into a chase across the highway. She only wants to drive the car home. Dust and firelight reach the mirror first.",
    cast: "Su Man, Gao Yi, Liang Ke",
    image: "/art/gearstorm.jpg",
    focus: "center 40%",
  }),
  show({
    id: "coldlane",
    title: "Cold Lane",
    kindLabel: "Series",
    genres: "Thriller · Drama",
    year: "2022",
    runtime: "51 min",
    seconds: 51 * 60,
    rating: "15+",
    badge: "Wednesdays",
    logline: "A field officer parked on the edge of the force, and a superior who never explains, keep the city's ugliest balance standing in one rainy lane.",
    cast: "Pei Shu, Jiang Heng, Luo Min",
    image: "/art/coldlane.jpg",
    focus: "center 45%",
    episodes: eps("Episode 1 · Rain night", "Episode 2 · Old file", "Episode 3 · The doorway"),
  }),
  show({
    id: "shoreline",
    title: "Shoreline",
    kindLabel: "Series",
    genres: "Comedy",
    year: "2023",
    runtime: "30 min",
    seconds: 30 * 60,
    rating: "12+",
    badge: "Wednesdays",
    logline: "Two old friends walk home through the cane fields. One unfinished sentence at the family table makes the joke impossible to keep going.",
    cast: "Ma Kuo, Sun Bei, Han Qing",
    image: "/art/shoreline.jpg",
    focus: "center 40%",
    episodes: eps("Episode 1 · Home", "Episode 2 · The ridge", "Episode 3 · That sentence"),
  }),
  show({
    id: "rift",
    title: "The Rift",
    kindLabel: "Series",
    genres: "Science fiction · Thriller",
    year: "2025",
    runtime: "46 min",
    seconds: 46 * 60,
    rating: "15+",
    badge: "Fridays",
    logline: "He wakes inside another version of his own life. To reach the original door, he first has to walk away from the most dangerous person there: himself.",
    cast: "Xu Yan, Shen Qing, Gu Lang",
    image: "/art/rift.jpg",
    focus: "center 50%",
    episodes: eps("Episode 1 · Waking", "Episode 2 · The other door", "Episode 3 · Walking back"),
  }),
  show({
    id: "shaft",
    title: "Shaft City",
    kindLabel: "Series",
    genres: "Science fiction · Adventure",
    year: "2026",
    runtime: "58 min",
    seconds: 58 * 60,
    rating: "13+",
    badge: "New season",
    logline: "After the shaft city's keeper disappears, an engineer follows a beam of daylight that should not exist, level by level, toward the sky.",
    cast: "Lin Zhao, Wei Nan, Qiu Ye",
    image: "/art/shaft.jpg",
    focus: "center 35%",
    episodes: eps("Episode 1 · Stopped", "Episode 2 · Upward", "Episode 3 · Daylight"),
  }),
  show({
    id: "yellow",
    title: "Yellow Lamp",
    kindLabel: "Film",
    genres: "Drama · Mystery",
    year: "2025",
    runtime: "1 hr 48 min",
    seconds: 108 * 60,
    rating: "15+",
    logline: "A night watchman notices that under the same yellow lamp, someone repeats the same sentence every night. He steps outside the light to listen.",
    cast: "Zheng Ke, Wu Man, Fang Li",
    image: "/art/yellow.jpg",
    focus: "center 30%",
  }),
  show({
    id: "orbit",
    title: "Silent Orbit",
    kindLabel: "Series",
    genres: "Science fiction",
    year: "2024",
    runtime: "49 min",
    seconds: 49 * 60,
    rating: "12+",
    badge: "Full season",
    logline: "On the seventh day without a signal, the station holds only her, and an observation window that is still slowly turning.",
    cast: "Cheng Nuo, Zhao Xi",
    image: "/art/orbit.jpg",
    focus: "center 42%",
    episodes: eps("Episode 1 · Out of contact", "Episode 2 · The window", "Episode 3 · Echo"),
  }),
];

export const nowPlaying: Item[] = [
  show({
    id: "tide",
    title: "Tide Line",
    kindLabel: "Film",
    genres: "Mystery · Adventure",
    year: "2025",
    runtime: "1 hr 56 min",
    seconds: 116 * 60,
    rating: "13+",
    badge: "New",
    logline: "A coastal survey becomes a flight after midnight. Something in the wave behind her is learning her heading.",
    cast: "Ye Yuan, Cao Ting",
    image: "/art/tide.jpg",
    focus: "center 40%",
  }),
  show({
    id: "nightshift",
    title: "Night Shift",
    kindLabel: "Film",
    genres: "Drama",
    year: "2023",
    runtime: "1 hr 42 min",
    seconds: 102 * 60,
    rating: "12+",
    logline: "An old driver and a new conductor in a yellow cap carry a city's last tram through a whole night of steam.",
    cast: "He Shu, Mi Li",
    image: "/art/nightshift.jpg",
    focus: "center 42%",
  }),
  show({
    id: "amberwake",
    title: "Amber Wake",
    kindLabel: "Film",
    genres: "Thriller",
    year: "2019",
    runtime: "1 hr 49 min",
    seconds: 109 * 60,
    rating: "16+",
    logline: "When the sleeper opens his eyes, the street has already turned amber. He has to find a way out before he goes quiet too.",
    cast: "Tan Shuo, Ni Ma, Bai Chuan",
    image: "/art/amberwake.jpg",
    focus: "center 58%",
  }),
  show({
    id: "logbook",
    title: "The Logbook",
    kindLabel: "Film",
    genres: "Drama · Adventure",
    year: "2021",
    runtime: "2 hr 4 min",
    seconds: 124 * 60,
    rating: "12+",
    logline: "A logbook swollen by seawater pulls a modern captain back into a storm that never made it onto the chart.",
    cast: "Shen Bo, Yu Ta",
    image: "/art/logbook.jpg",
    focus: "center 45%",
  }),
  show({
    id: "thundercrew",
    title: "Heat Crew",
    kindLabel: "Film",
    genres: "Comedy · Action",
    year: "2026",
    runtime: "1 hr 58 min",
    seconds: 118 * 60,
    rating: "15+",
    badge: "New",
    logline: "Four people walk into the rainforest to finish one last scene. The fire arrives before the plot, and the laughter before the plan.",
    cast: "Jia Ke, Song Ping, Ding Lan, Mu Qing",
    image: "/art/thundercrew.jpg",
    focus: "center 40%",
  }),
  show({
    id: "longroad",
    title: "The Long Way",
    kindLabel: "Film",
    genres: "Comedy · Romance",
    year: "2024",
    runtime: "1 hr 37 min",
    seconds: 97 * 60,
    rating: "12+",
    logline: "They agreed not to drive tonight. So every night street in the city becomes a reason to walk home slowly.",
    cast: "Qiao An, Liang Xing",
    image: "/art/longroad.jpg",
    focus: "center 42%",
  }),
  show({
    id: "glasshouse",
    title: "Glasshouse",
    kindLabel: "Series",
    genres: "Drama · Nature",
    year: "2026",
    runtime: "44 min",
    seconds: 44 * 60,
    rating: "All ages",
    badge: "New",
    logline: "Inside a sealed garden the size of a station, a botanist keeps the night temperature honest while the plants start keeping their own hours.",
    cast: "He Lin, Mara Voss",
    image: "/art/glasshouse.jpg",
    focus: "center 40%",
    episodes: eps("Episode 1 · First mist", "Episode 2 · Night heat", "Episode 3 · Open vent"),
  }),
  show({
    id: "fieldnotes",
    title: "Field Notes",
    kindLabel: "Film",
    genres: "Documentary · Drama",
    year: "2025",
    runtime: "1 hr 28 min",
    seconds: 88 * 60,
    rating: "All ages",
    logline: "A rainfall trial over a cane field was supposed to be a quiet afternoon of buckets and hoses. The sky had a different schedule.",
    cast: "Research unit, south plot",
    image: "/art/fieldnotes.jpg",
    focus: "center 45%",
  }),
  show({
    id: "paperboats",
    title: "Paper Boats",
    kindLabel: "Film",
    genres: "Family · Comedy",
    year: "2022",
    runtime: "1 hr 34 min",
    seconds: 94 * 60,
    rating: "All ages",
    logline: "A canal, a stack of unfinished homework, and a fleet of paper boats that refuse to sink before they reach the lock.",
    cast: "The lock kids",
    image: "/art/paperboats.jpg",
    focus: "center 50%",
  }),
  show({
    id: "meridian",
    title: "Meridian",
    kindLabel: "Film",
    genres: "Drama · Adventure",
    year: "2020",
    runtime: "1 hr 51 min",
    seconds: 111 * 60,
    rating: "12+",
    logline: "At a polar station the sun barely clears the ice. One warm window is enough to start an argument about who walks out first.",
    cast: "Rye Holm, Anya Pell",
    image: "/art/meridian.jpg",
    focus: "center 40%",
  }),
];

export const events: Item[] = [
  {
    id: "gulf",
    title: "Bay Night Race",
    variant: "event",
    kindLabel: "Live",
    genres: "Racing · Feature",
    year: "2026",
    runtime: "Live",
    seconds: 90 * 60,
    rating: "All ages",
    badge: "Tonight",
    date: "Oct 11, 2026",
    logline: "Once the lights come up, the bay circuit is only braking points and radio. The feature runs from dusk straight into the night.",
    cast: "Coast circuit",
    creditLabel: "Coverage",
    image: "/art/gulf.jpg",
    focus: "center",
  },
  {
    id: "youth",
    title: "Junior Heat",
    variant: "event",
    kindLabel: "Live",
    genres: "Racing · Academy",
    year: "2026",
    runtime: "Live",
    seconds: 60 * 60,
    rating: "All ages",
    badge: "Day session",
    date: "Oct 11, 2026",
    logline: "A smaller circuit, a louder heartbeat. The junior field spends one afternoon deciding who starts the night race.",
    cast: "Academy desk",
    creditLabel: "Coverage",
    image: "/art/youth.jpg",
    focus: "center",
  },
  {
    id: "quali",
    title: "Qualifying Night",
    variant: "event",
    kindLabel: "Live",
    genres: "Racing · Qualifying",
    year: "2026",
    runtime: "Live",
    seconds: 70 * 60,
    rating: "All ages",
    badge: "Replay",
    date: "Oct 10, 2026",
    logline: "One lap sets the grid. Qualifying does not tell a story. It leaves the bravest brake on the timing screen.",
    cast: "Timing tower",
    creditLabel: "Coverage",
    image: "/art/quali.jpg",
    focus: "center",
  },
  {
    id: "sprint",
    title: "Final Sprint",
    variant: "event",
    kindLabel: "Live",
    genres: "Racing · Sprint",
    year: "2026",
    runtime: "Live",
    seconds: 45 * 60,
    rating: "All ages",
    badge: "Highlights",
    date: "Oct 10, 2026",
    logline: "Short distance, no saving the tires. The sprint compresses a week's setup into a few minutes of side-by-side.",
    cast: "Track commentary",
    creditLabel: "Coverage",
    image: "/art/sprint.jpg",
    focus: "center",
  },
];

export const librarySeed: Record<string, number> = {
  tide: 0.62,
  coldlane: 0.28,
  shaft: 0.47,
  longroad: 0.16,
  yellow: 0.73,
  logbook: 0.11,
  glasshouse: 0.35,
  paperboats: 0.54,
};

export function posterSources(): string[] {
  return [...ranked, ...nowPlaying, ...events].map((item) => item.image).filter((src): src is string => Boolean(src));
}

export function buildRows(progress: Record<string, number>, saved: string[]): Row[] {
  const shows = [...ranked, ...nowPlaying];
  const rows: Row[] = [
    { id: "top", label: "Top 10", variant: "ranked", items: ranked },
    { id: "now", label: "Now showing", variant: "poster", items: nowPlaying },
  ];
  const cont = shows.filter((item) => {
    const value = progress[item.id] ?? 0;
    return value > 0.04 && value < 0.97;
  });
  if (cont.length) rows.push({ id: "continue", label: "Continue watching", variant: "landscape", items: cont });
  rows.push({ id: "live", label: "This week", variant: "event", items: events });
  const mine = [...shows, ...events].filter((item) => saved.includes(item.id));
  if (mine.length) rows.push({ id: "mine", label: "My list", variant: "poster", items: mine });
  return rows;
}
