import { Genre } from "@/features/general/data/constants/use-genres";

export type TasteGenre = Genre & {
  mediaType: "movie" | "series" | "shared";
  keywords: Keyword[];
};

export type Keyword = {
  id: string;
  label: string;
};

export const TASTE_GENRES: TasteGenre[] = [
  {
    id: 28,
    name: "Action",
    emoji: "💥",
    mediaType: "movie",
    keywords: [
      {
        id: "Action-2343",
        label: "Magic",
      },
      {
        id: "Action-9715",
        label: "Superhero",
      },
      {
        id: "Action-10292",
        label: "Gore",
      },
      {
        id: "Action-188955",
        label: "Hand to hand combat",
      },
      {
        id: "Action-269233",
        label: "Good versus evil",
      },
      {
        id: "Action-33637",
        label: "Super power",
      },
      {
        id: "Action-155030",
        label: "Superhero team",
      },
      {
        id: "Action-1501",
        label: "Allegory",
      },
      {
        id: "Action-2095",
        label: "Anti hero",
      },
      {
        id: "Action-10085",
        label: "Betrayal",
      },
    ],
  },
  {
    id: 12,
    name: "Adventure",
    emoji: "🏕️",
    mediaType: "movie",
    keywords: [
      {
        id: "Adventure-2343",
        label: "Magic",
      },
      {
        id: "Adventure-9715",
        label: "Superhero",
      },
      {
        id: "Adventure-3289",
        label: "Villain",
      },
      {
        id: "Adventure-9882",
        label: "Space",
      },
      {
        id: "Adventure-11477",
        label: "Anthropomorphism",
      },
      {
        id: "Adventure-6054",
        label: "Friendship",
      },
      {
        id: "Adventure-3801",
        label: "Space travel",
      },
      {
        id: "Adventure-155030",
        label: "Superhero team",
      },
      {
        id: "Adventure-33637",
        label: "Super power",
      },
      {
        id: "Adventure-180734",
        label: "Masked superhero",
      },
    ],
  },
  {
    id: 14,
    name: "Fantasy",
    emoji: "🧙‍♂️",
    mediaType: "movie",
    keywords: [
      {
        id: "Fantasy-2343",
        label: "Magic",
      },
      {
        id: "Fantasy-616",
        label: "Witch",
      },
      {
        id: "Fantasy-269233",
        label: "Good versus evil",
      },
      {
        id: "Fantasy-177912",
        label: "Wizard",
      },
      {
        id: "Fantasy-3289",
        label: "Villain",
      },
      {
        id: "Fantasy-162846",
        label: "Ghost",
      },
      {
        id: "Fantasy-336530",
        label: "Teen fantasy",
      },
      {
        id: "Fantasy-170362",
        label: "Fantasy world",
      },
      {
        id: "Fantasy-14643",
        label: "Battle",
      },
      {
        id: "Fantasy-6054",
        label: "Friendship",
      },
    ],
  },
  {
    id: 36,
    name: "History",
    emoji: "🏛️",
    mediaType: "movie",
    keywords: [
      {
        id: "History-1956",
        label: "World war ii",
      },
      {
        id: "History-5565",
        label: "Biography",
      },
      {
        id: "History-192772",
        label: "Historical drama",
      },
      {
        id: "History-12995",
        label: "Historical fiction",
      },
      {
        id: "History-15060",
        label: "Period drama",
      },
      {
        id: "History-207883",
        label: "1940s",
      },
      {
        id: "History-697",
        label: "Loss of loved one",
      },
      {
        id: "History-11001",
        label: "Religion",
      },
      {
        id: "History-9725",
        label: "Sword fight",
      },
      {
        id: "History-158718",
        label: "LGBT",
      },
    ],
  },
  {
    id: 27,
    name: "Horror",
    emoji: "👻",
    mediaType: "movie",
    keywords: [
      {
        id: "Horror-256183",
        label: "Supernatural horror",
      },
      {
        id: "Horror-6152",
        label: "Supernatural",
      },
      {
        id: "Horror-295907",
        label: "Psychological horror",
      },
      {
        id: "Horror-315058",
        label: "Horror",
      },
      {
        id: "Horror-9826",
        label: "Murder",
      },
      {
        id: "Horror-1299",
        label: "Monster",
      },
      {
        id: "Horror-4720",
        label: "Ritual",
      },
      {
        id: "Horror-50009",
        label: "Survival horror",
      },
      {
        id: "Horror-10714",
        label: "Serial killer",
      },
      {
        id: "Horror-12339",
        label: "Slasher",
      },
    ],
  },
  {
    id: 10402,
    name: "Music",
    emoji: "🎸",
    mediaType: "movie",
    keywords: [
      {
        id: "Music-4344",
        label: "Musical",
      },
      {
        id: "Music-4048",
        label: "Musician",
      },
      {
        id: "Music-6029",
        label: "Concert",
      },
      {
        id: "Music-10229",
        label: "Singer",
      },
      {
        id: "Music-325761",
        label: "Admiring",
      },
      {
        id: "Music-5565",
        label: "Biography",
      },
      {
        id: "Music-246",
        label: "Dancing",
      },
      {
        id: "Music-3490",
        label: "Pop star",
      },
      {
        id: "Music-242",
        label: "New york city",
      },
      {
        id: "Music-578",
        label: "Rock 'n' roll",
      },
    ],
  },
  {
    id: 10749,
    name: "Romance",
    emoji: "💖",
    mediaType: "movie",
    keywords: [
      {
        id: "Romance-9673",
        label: "Love",
      },
      {
        id: "Romance-158713",
        label: "Bdsm",
      },
      {
        id: "Romance-324429",
        label: "Romantic",
      },
      {
        id: "Romance-304976",
        label: "Romantic drama",
      },
      {
        id: "Romance-1664",
        label: "Eroticism",
      },
      {
        id: "Romance-3691",
        label: "Forbidden love",
      },
      {
        id: "Romance-10614",
        label: "Tragedy",
      },
      {
        id: "Romance-267122",
        label: "Sex",
      },
      {
        id: "Romance-697",
        label: "Loss of loved one",
      },
      {
        id: "Romance-34094",
        label: "Extramarital affair",
      },
    ],
  },
  {
    id: 878,
    name: "Science Fiction",
    emoji: "👽",
    mediaType: "movie",
    keywords: [
      {
        id: "Science Fiction-9715",
        label: "Superhero",
      },
      {
        id: "Science Fiction-4565",
        label: "Dystopia",
      },
      {
        id: "Science Fiction-33637",
        label: "Super power",
      },
      {
        id: "Science Fiction-3801",
        label: "Space travel",
      },
      {
        id: "Science Fiction-9882",
        label: "Space",
      },
      {
        id: "Science Fiction-155030",
        label: "Superhero team",
      },
      {
        id: "Science Fiction-242",
        label: "New york city",
      },
      {
        id: "Science Fiction-310",
        label: "Artificial intelligence (a.i.)",
      },
      {
        id: "Science Fiction-348204",
        label: "Dystopian",
      },
      {
        id: "Science Fiction-1308",
        label: "Secret identity",
      },
    ],
  },
  {
    id: 10770,
    name: "TV Movie",
    emoji: "📺",
    mediaType: "movie",
    keywords: [
      {
        id: "TV Movie-4344",
        label: "Musical",
      },
      {
        id: "TV Movie-6270",
        label: "High school",
      },
      {
        id: "TV Movie-65",
        label: "Holiday",
      },
      {
        id: "TV Movie-2343",
        label: "Magic",
      },
      {
        id: "TV Movie-3289",
        label: "Villain",
      },
      {
        id: "TV Movie-10683",
        label: "Coming of age",
      },
      {
        id: "TV Movie-10244",
        label: "Based on cartoon",
      },
      {
        id: "TV Movie-931",
        label: "Jealousy",
      },
      {
        id: "TV Movie-703",
        label: "Detective",
      },
      {
        id: "TV Movie-264598",
        label: "Tv special",
      },
    ],
  },
  {
    id: 53,
    name: "Thriller",
    emoji: "🤯",
    mediaType: "movie",
    keywords: [
      {
        id: "Thriller-5265",
        label: "Espionage",
      },
      {
        id: "Thriller-10292",
        label: "Gore",
      },
      {
        id: "Thriller-10085",
        label: "Betrayal",
      },
      {
        id: "Thriller-9826",
        label: "Murder",
      },
      {
        id: "Thriller-314730",
        label: "Suspenseful",
      },
      {
        id: "Thriller-10349",
        label: "Survival",
      },
      {
        id: "Thriller-50009",
        label: "Survival horror",
      },
      {
        id: "Thriller-12377",
        label: "Zombie",
      },
      {
        id: "Thriller-207268",
        label: "Neo-noir",
      },
      {
        id: "Thriller-6149",
        label: "Police",
      },
    ],
  },
  {
    id: 10752,
    name: "War",
    emoji: "⚔️",
    mediaType: "movie",
    keywords: [
      {
        id: "War-1956",
        label: "World war ii",
      },
      {
        id: "War-207883",
        label: "1940s",
      },
      {
        id: "War-13065",
        label: "Soldier",
      },
      {
        id: "War-5565",
        label: "Biography",
      },
      {
        id: "War-273967",
        label: "War",
      },
      {
        id: "War-2652",
        label: "Nazi",
      },
      {
        id: "War-2957",
        label: "Vietnam war",
      },
      {
        id: "War-6092",
        label: "Army",
      },
      {
        id: "War-162365",
        label: "Military",
      },
      {
        id: "War-1701",
        label: "Hero",
      },
    ],
  },
  {
    id: 10759,
    name: "Action & Adventure",
    emoji: "🦸‍♂️",
    mediaType: "series",
    keywords: [
      {
        id: "Action & Adventure-33637",
        label: "Super power",
      },
      {
        id: "Action & Adventure-207826",
        label: "Shounen",
      },
      {
        id: "Action & Adventure-322942",
        label: "Adventure",
      },
      {
        id: "Action & Adventure-9715",
        label: "Superhero",
      },
      {
        id: "Action & Adventure-779",
        label: "Martial arts",
      },
      {
        id: "Action & Adventure-9951",
        label: "Alien",
      },
      {
        id: "Action & Adventure-2343",
        label: "Magic",
      },
      {
        id: "Action & Adventure-293198",
        label: "Fantasy",
      },
      {
        id: "Action & Adventure-10292",
        label: "Gore",
      },
      {
        id: "Action & Adventure-6152",
        label: "Supernatural",
      },
    ],
  },
  {
    id: 10762,
    name: "Kids",
    emoji: "🧸",
    mediaType: "series",
    keywords: [
      {
        id: "Kids-6513",
        label: "Cartoon",
      },
      {
        id: "Kids-9715",
        label: "Superhero",
      },
      {
        id: "Kids-6054",
        label: "Friendship",
      },
      {
        id: "Kids-259376",
        label: "Playful",
      },
      {
        id: "Kids-178898",
        label: "Cartoon dog",
      },
      {
        id: "Kids-2343",
        label: "Magic",
      },
      {
        id: "Kids-3289",
        label: "Villain",
      },
      {
        id: "Kids-18257",
        label: "Educational",
      },
      {
        id: "Kids-164246",
        label: "Nostalgic",
      },
      {
        id: "Kids-18035",
        label: "Family",
      },
    ],
  },
  {
    id: 10763,
    name: "News",
    emoji: "📰",
    mediaType: "series",
    keywords: [
      {
        id: "News-6078",
        label: "Politics",
      },
      {
        id: "News-169086",
        label: "Political satire",
      },
      {
        id: "News-193164",
        label: "Current affairs",
      },
      {
        id: "News-242216",
        label: "Late-night show",
      },
      {
        id: "News-191509",
        label: "News",
      },
      {
        id: "News-13384",
        label: "Morning show",
      },
      {
        id: "News-3741",
        label: "Talk show",
      },
      {
        id: "News-239647",
        label: "Magazine show",
      },
      {
        id: "News-195207",
        label: "Panel show",
      },
      {
        id: "News-33847",
        label: "British politics",
      },
    ],
  },
  {
    id: 10764,
    name: "Reality",
    emoji: "🎥",
    mediaType: "series",
    keywords: [
      {
        id: "Reality-194610",
        label: "Variety show",
      },
      {
        id: "Reality-271",
        label: "Competition",
      },
      {
        id: "Reality-250845",
        label: "Reality competition",
      },
      {
        id: "Reality-291807",
        label: "Reality show",
      },
      {
        id: "Reality-4325",
        label: "Game show",
      },
      {
        id: "Reality-15479",
        label: "Fashion",
      },
      {
        id: "Reality-167198",
        label: "Fashion show",
      },
      {
        id: "Reality-6383",
        label: "Music competition",
      },
      {
        id: "Reality-186120",
        label: "Singing competition",
      },
      {
        id: "Reality-40870",
        label: "Race",
      },
    ],
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
    emoji: "🚀",
    mediaType: "series",
    keywords: [
      {
        id: "Sci-Fi & Fantasy-6152",
        label: "Supernatural",
      },
      {
        id: "Sci-Fi & Fantasy-33637",
        label: "Super power",
      },
      {
        id: "Sci-Fi & Fantasy-207826",
        label: "Shounen",
      },
      {
        id: "Sci-Fi & Fantasy-322942",
        label: "Adventure",
      },
      {
        id: "Sci-Fi & Fantasy-779",
        label: "Martial arts",
      },
      {
        id: "Sci-Fi & Fantasy-293198",
        label: "Fantasy",
      },
      {
        id: "Sci-Fi & Fantasy-2343",
        label: "Magic",
      },
      {
        id: "Sci-Fi & Fantasy-9951",
        label: "Alien",
      },
      {
        id: "Sci-Fi & Fantasy-10292",
        label: "Gore",
      },
      {
        id: "Sci-Fi & Fantasy-315058",
        label: "Horror",
      },
    ],
  },
  {
    id: 10766,
    name: "Soap",
    emoji: "🧼",
    mediaType: "series",
    keywords: [
      {
        id: "Soap-199262",
        label: "Telenovela",
      },
      {
        id: "Soap-291959",
        label: "Soap opera",
      },
      {
        id: "Soap-11612",
        label: "Hospital",
      },
      {
        id: "Soap-316421",
        label: "Drama",
      },
      {
        id: "Soap-13005",
        label: "Doctor",
      },
      {
        id: "Soap-208788",
        label: "Medical drama",
      },
      {
        id: "Soap-193400",
        label: "Teen drama",
      },
      {
        id: "Soap-237462",
        label: "Wealthy family",
      },
      {
        id: "Soap-9840",
        label: "Romance",
      },
      {
        id: "Soap-11157",
        label: "Sibling rivalry",
      },
    ],
  },
  {
    id: 10767,
    name: "Talk",
    emoji: "💬",
    mediaType: "series",
    keywords: [
      {
        id: "Talk-3741",
        label: "Talk show",
      },
      {
        id: "Talk-242216",
        label: "Late-night show",
      },
      {
        id: "Talk-6562",
        label: "Celebrity",
      },
      {
        id: "Talk-234957",
        label: "Celebrity interview",
      },
      {
        id: "Talk-320420",
        label: "Hilarious",
      },
      {
        id: "Talk-198299",
        label: "Live music",
      },
      {
        id: "Talk-276775",
        label: "Irreverent",
      },
      {
        id: "Talk-325830",
        label: "Informative",
      },
      {
        id: "Talk-225273",
        label: "K-pop",
      },
      {
        id: "Talk-197715",
        label: "Talk",
      },
    ],
  },
  {
    id: 10768,
    name: "War & Politics",
    emoji: "⚖️",
    mediaType: "series",
    keywords: [
      {
        id: "War & Politics-162365",
        label: "Military",
      },
      {
        id: "War & Politics-6078",
        label: "Politics",
      },
      {
        id: "War & Politics-1956",
        label: "World war ii",
      },
      {
        id: "War & Politics-192772",
        label: "Historical drama",
      },
      {
        id: "War & Politics-273967",
        label: "War",
      },
      {
        id: "War & Politics-15126",
        label: "Historical",
      },
      {
        id: "War & Politics-10046",
        label: "Mecha",
      },
      {
        id: "War & Politics-321464",
        label: "Intense",
      },
      {
        id: "War & Politics-13015",
        label: "Terrorism",
      },
      {
        id: "War & Politics-264792",
        label: "Political",
      },
    ],
  },
  {
    id: 16,
    name: "Animation",
    emoji: "🐭",
    mediaType: "shared",
    keywords: [
      {
        id: "Animation-3289",
        label: "Villain",
      },
      {
        id: "Animation-207826",
        label: "Shounen",
      },
      {
        id: "Animation-6054",
        label: "Friendship",
      },
      {
        id: "Animation-779",
        label: "Martial arts",
      },
      {
        id: "Animation-11477",
        label: "Anthropomorphism",
      },
      {
        id: "Animation-293198",
        label: "Fantasy",
      },
      {
        id: "Animation-6152",
        label: "Supernatural",
      },
      {
        id: "Animation-2343",
        label: "Magic",
      },
      {
        id: "Animation-161919",
        label: "Adult animation",
      },
      {
        id: "Animation-322942",
        label: "Adventure",
      },
    ],
  },
  {
    id: 35,
    name: "Comedy",
    emoji: "😂",
    mediaType: "shared",
    keywords: [
      {
        id: "Comedy-193171",
        label: "Sitcom",
      },
      {
        id: "Comedy-18035",
        label: "Family",
      },
      {
        id: "Comedy-325765",
        label: "Amused",
      },
      {
        id: "Comedy-320420",
        label: "Hilarious",
      },
      {
        id: "Comedy-6054",
        label: "Friendship",
      },
      {
        id: "Comedy-3289",
        label: "Villain",
      },
      {
        id: "Comedy-325782",
        label: "Cheerful",
      },
      {
        id: "Comedy-380",
        label: "Sibling relationship",
      },
      {
        id: "Comedy-11477",
        label: "Anthropomorphism",
      },
      {
        id: "Comedy-242",
        label: "New york city",
      },
    ],
  },
  {
    id: 80,
    name: "Crime",
    emoji: "🕵️‍♂️",
    mediaType: "shared",
    keywords: [
      {
        id: "Crime-6149",
        label: "Police",
      },
      {
        id: "Crime-703",
        label: "Detective",
      },
      {
        id: "Crime-9826",
        label: "Murder",
      },
      {
        id: "Crime-268067",
        label: "Police procedural",
      },
      {
        id: "Crime-242",
        label: "New york city",
      },
      {
        id: "Crime-9748",
        label: "Revenge",
      },
      {
        id: "Crime-12670",
        label: "Los angeles, california",
      },
      {
        id: "Crime-10291",
        label: "Organized crime",
      },
      {
        id: "Crime-207268",
        label: "Neo-noir",
      },
      {
        id: "Crime-3149",
        label: "Gangster",
      },
    ],
  },
  {
    id: 99,
    name: "Documentary",
    emoji: "📜",
    mediaType: "shared",
    keywords: [
      {
        id: "Documentary-4434",
        label: "Interview",
      },
      {
        id: "Documentary-18330",
        label: "Nature",
      },
      {
        id: "Documentary-33722",
        label: "True crime",
      },
      {
        id: "Documentary-159290",
        label: "Sports documentary",
      },
      {
        id: "Documentary-282080",
        label: "Documentary",
      },
      {
        id: "Documentary-221355",
        label: "Nature documentary",
      },
      {
        id: "Documentary-246377",
        label: "Music documentary",
      },
      {
        id: "Documentary-325761",
        label: "Admiring",
      },
      {
        id: "Documentary-13042",
        label: "Football (soccer)",
      },
      {
        id: "Documentary-155477",
        label: "Softcore",
      },
    ],
  },
  {
    id: 18,
    name: "Drama",
    emoji: "💔",
    mediaType: "shared",
    keywords: [
      {
        id: "Drama-268067",
        label: "Police procedural",
      },
      {
        id: "Drama-189402",
        label: "Crime investigation",
      },
      {
        id: "Drama-242",
        label: "New york city",
      },
      {
        id: "Drama-6149",
        label: "Police",
      },
      {
        id: "Drama-157241",
        label: "Criminal investigation",
      },
      {
        id: "Drama-703",
        label: "Detective",
      },
      {
        id: "Drama-311315",
        label: "Dramatic",
      },
      {
        id: "Drama-9673",
        label: "Love",
      },
      {
        id: "Drama-15060",
        label: "Period drama",
      },
      {
        id: "Drama-9715",
        label: "Superhero",
      },
    ],
  },
  {
    id: 10751,
    name: "Family",
    emoji: "🏡",
    mediaType: "shared",
    keywords: [
      {
        id: "Family-3289",
        label: "Villain",
      },
      {
        id: "Family-6054",
        label: "Friendship",
      },
      {
        id: "Family-193171",
        label: "Sitcom",
      },
      {
        id: "Family-18035",
        label: "Family",
      },
      {
        id: "Family-11477",
        label: "Anthropomorphism",
      },
      {
        id: "Family-10683",
        label: "Coming of age",
      },
      {
        id: "Family-325782",
        label: "Cheerful",
      },
      {
        id: "Family-6513",
        label: "Cartoon",
      },
      {
        id: "Family-2343",
        label: "Magic",
      },
      {
        id: "Family-18165",
        label: "Animals",
      },
    ],
  },
  {
    id: 9648,
    name: "Mystery",
    emoji: "🧚‍♀️",
    mediaType: "shared",
    keywords: [
      {
        id: "Mystery-703",
        label: "Detective",
      },
      {
        id: "Mystery-9826",
        label: "Murder",
      },
      {
        id: "Mystery-6152",
        label: "Supernatural",
      },
      {
        id: "Mystery-6149",
        label: "Police",
      },
      {
        id: "Mystery-5340",
        label: "Investigation",
      },
      {
        id: "Mystery-161982",
        label: "Murder investigation",
      },
      {
        id: "Mystery-315058",
        label: "Horror",
      },
      {
        id: "Mystery-10714",
        label: "Serial killer",
      },
      {
        id: "Mystery-256183",
        label: "Supernatural horror",
      },
      {
        id: "Mystery-207046",
        label: "Murder mystery",
      },
    ],
  },
  {
    id: 37,
    name: "Western",
    emoji: "🤠",
    mediaType: "shared",
    keywords: [
      {
        id: "Western-207928",
        label: "19th century",
      },
      {
        id: "Western-155573",
        label: "Wild west",
      },
      {
        id: "Western-2752",
        label: "Ranch",
      },
      {
        id: "Western-10322",
        label: "Native american",
      },
      {
        id: "Western-798",
        label: "Sheriff",
      },
      {
        id: "Western-1556",
        label: "Texas",
      },
      {
        id: "Western-801",
        label: "Bounty hunter",
      },
      {
        id: "Western-75",
        label: "Gunslinger",
      },
      {
        id: "Western-155291",
        label: "Cowboy",
      },
      {
        id: "Western-9503",
        label: "Outlaw",
      },
    ],
  },
];
