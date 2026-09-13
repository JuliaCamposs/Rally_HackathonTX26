import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AV_COLORS = [
  "#2e8b6f",
  "#1d685d",
  "#5c8a3a",
  "#0f5c4c",
  "#3f7f66",
  "#6b9b45",
  "#256b5c",
  "#4a8f5e",
];

function avColor(name: string): string {
  let s = 0;
  for (let i = 0; i < name.length; i++) s += name.charCodeAt(i);
  return AV_COLORS[s % AV_COLORS.length];
}

const MIN = 60_000;

type SeedMessage = { who: string; agoMin: number; body: string };

type SeedEvent = {
  slug: string;
  title: string;
  category: "sports" | "study" | "social" | "workshops" | "clubs";
  source: "official" | "community";
  venueName: string;
  lat: number;
  lng: number;
  organizerName: string;
  organizerRole: string;
  description: string;
  startOffsetMin: number;
  endOffsetMin: number;
  people: string[];
  msgs: SeedMessage[];
};

const EVENTS: SeedEvent[] = [
  {
    slug: "volleyball",
    title: "Pickup Volleyball",
    category: "sports",
    source: "community",
    venueName: "Rec Center Sand Courts",
    lat: 33.5827391,
    lng: -101.8847441,
    organizerName: "Maya Ruiz",
    organizerRole: "Student · Kinesiology",
    description:
      "Casual 4v4 on the sand courts. We rotate teams every game so nobody sits out long. All skill levels — half of us learned last semester. Ball is covered, bring water.",
    startOffsetMin: -20,
    endOffsetMin: 90,
    people: ["Maya Ruiz", "Devon Clark", "Priya Nair", "Sam Okafor", "Iris Lang", "Tyler Boone", "Ana Guzman"],
    msgs: [
      { who: "Maya Ruiz", agoMin: 58, body: "Courts 2 and 3 are ours till 5:30 — just claimed them" },
      { who: "Tyler Boone", agoMin: 49, body: "omw, five min out" },
      { who: "Priya Nair", agoMin: 16, body: "we have 7, need one more for even teams" },
      { who: "Maya Ruiz", agoMin: 8, body: "anyone coming — we are the loud group closest to the parking lot" },
    ],
  },
  {
    slug: "cs-study",
    title: "CS Study Group — Finals Prep",
    category: "study",
    source: "community",
    venueName: "University Library, 3rd Floor East",
    lat: 33.5814133,
    lng: -101.8763813,
    organizerName: "Devon Clark",
    organizerRole: "Student · Computer Science",
    description:
      "Working through the CS 2413 practice exam together. We grabbed the big table by the windows. Come and go as you need — someone is always here to explain a problem.",
    startOffsetMin: -120,
    endOffsetMin: 120,
    people: ["Devon Clark", "Iris Lang", "Noah Whitfield", "Sasha Kim", "Ben Ortiz", "Lena Park", "Amir Haddad", "Grace Yun", "Owen Diaz", "Rita Alvarez", "Kai Mensah", "Jules Weber"],
    msgs: [
      { who: "Devon Clark", agoMin: 115, body: "Big table by the east windows, look for the whiteboard" },
      { who: "Sasha Kim", agoMin: 72, body: "q7 on the practice exam is wrong in the answer key btw" },
      { who: "Lena Park", agoMin: 50, body: "confirmed, it should be O(n log n) not O(n)" },
      { who: "Devon Clark", agoMin: 22, body: "we are here till 6, table fits ~4 more" },
    ],
  },
  {
    slug: "acm",
    title: "ACM General Meeting",
    category: "clubs",
    source: "official",
    venueName: "Engineering Center, Room 101",
    lat: 33.5872711,
    lng: -101.8753164,
    organizerName: "ACM at Texas Tech",
    organizerRole: "Registered student organization",
    description:
      "Monthly general meeting. This month: a walkthrough of the spring hackathon rules, officer elections, and a short talk from an alum now at a robotics startup in Austin. Pizza at 6.",
    startOffsetMin: 120,
    endOffsetMin: 195,
    people: ["Noah Whitfield", "Grace Yun", "Amir Haddad", "Rita Alvarez", "Kai Mensah", "Owen Diaz", "Sasha Kim", "Ben Ortiz", "Lena Park", "Jules Weber", "Iris Lang", "Devon Clark", "Maya Ruiz", "Tyler Boone", "Ana Guzman", "Priya Nair", "Sam Okafor", "Hana Fischer", "Leo Vance", "Mei Tanaka", "Cole Bryant", "Nadia Petrov", "Ravi Shah", "Elena Moss", "Finn Doyle", "Zara Ahmed", "Otto Lind", "Bea Carver", "Ines Rojas", "Marcus Webb", "Yuki Sato", "Dara Nolan", "Theo Blake", "Anya Volkov"],
    msgs: [
      { who: "ACM at Texas Tech", agoMin: 418, body: "Room changed to EC 101 — bigger room, we outgrew 204" },
      { who: "Grace Yun", agoMin: 345, body: "are officer nominations still open?" },
      { who: "ACM at Texas Tech", agoMin: 329, body: "Yes, until we start voting at 6:30. Nominate from the floor." },
      { who: "Kai Mensah", agoMin: 260, body: "is the alum talk being recorded?" },
    ],
  },
  {
    slug: "resume",
    title: "Résumé Workshop",
    category: "workshops",
    source: "official",
    venueName: "Student Union, Room 205",
    lat: 33.5822,
    lng: -101.874,
    organizerName: "University Career Center",
    organizerRole: "Campus department",
    description:
      "Drop-in résumé review with career advisors. Bring a printed copy or a laptop. Advisors are working one-on-one, typical wait is under ten minutes. Tailored feedback for engineering and business tracks.",
    startOffsetMin: -60,
    endOffsetMin: 60,
    people: ["Hana Fischer", "Leo Vance", "Mei Tanaka", "Cole Bryant", "Nadia Petrov", "Ravi Shah", "Elena Moss", "Finn Doyle", "Zara Ahmed", "Otto Lind", "Bea Carver", "Ines Rojas", "Marcus Webb", "Yuki Sato", "Dara Nolan", "Theo Blake", "Anya Volkov", "Grace Yun", "Owen Diaz", "Rita Alvarez", "Ben Ortiz"],
    msgs: [
      { who: "University Career Center", agoMin: 68, body: "Doors open, three advisors in today" },
      { who: "Leo Vance", agoMin: 34, body: "walked in at 3:20, was seen in about 5 min" },
      { who: "Nadia Petrov", agoMin: 12, body: "do they review LinkedIn too or just the résumé?" },
      { who: "University Career Center", agoMin: 5, body: "Both — bring your profile up on your phone and we will go through it." },
    ],
  },
  {
    slug: "watch",
    title: "Watch Party: Tech vs. Baylor",
    category: "social",
    source: "community",
    venueName: "Student Union Lounge, ground floor",
    lat: 33.58235,
    lng: -101.87415,
    organizerName: "Sam Okafor",
    organizerRole: "Student · Marketing",
    description:
      "Big screen in the SUB lounge is free tonight. Getting there early to hold the couches. Wear red and black. Someone said they are bringing a speaker for the pregame.",
    startOffsetMin: 180,
    endOffsetMin: 360,
    people: ["Sam Okafor", "Ana Guzman", "Tyler Boone", "Cole Bryant", "Marcus Webb", "Finn Doyle", "Theo Blake", "Bea Carver", "Yuki Sato", "Zara Ahmed", "Otto Lind", "Dara Nolan", "Ines Rojas", "Elena Moss", "Ravi Shah", "Mei Tanaka", "Leo Vance", "Hana Fischer"],
    msgs: [
      { who: "Sam Okafor", agoMin: 320, body: "Getting there at 6:30 to grab the couch section" },
      { who: "Ana Guzman", agoMin: 288, body: "i can bring the speaker for pregame" },
      { who: "Cole Bryant", agoMin: 220, body: "is the sub lounge the one with the big screen or the small one" },
      { who: "Sam Okafor", agoMin: 216, body: "Big one, ground floor past the food court" },
    ],
  },
  {
    slug: "salsa",
    title: "Salsa Night on the Circle",
    category: "social",
    source: "official",
    venueName: "Memorial Circle lawn",
    lat: 33.584452,
    lng: -101.8746816,
    organizerName: "Hispanic Student Society",
    organizerRole: "Registered student organization",
    description:
      "Outdoor salsa under the lights. Free beginner lesson at 8, open dancing from 8:45. No partner and no experience needed — the lesson starts from the basic step. Sound system and floor provided.",
    startOffsetMin: 240,
    endOffsetMin: 390,
    people: ["Ines Rojas", "Ana Guzman", "Rita Alvarez", "Elena Moss", "Zara Ahmed", "Yuki Sato", "Mei Tanaka", "Nadia Petrov", "Bea Carver", "Dara Nolan", "Anya Volkov", "Hana Fischer", "Grace Yun", "Priya Nair", "Iris Lang", "Lena Park", "Sasha Kim", "Maya Ruiz", "Theo Blake", "Marcus Webb", "Finn Doyle", "Otto Lind", "Ravi Shah", "Leo Vance", "Cole Bryant", "Owen Diaz"],
    msgs: [
      { who: "Hispanic Student Society", agoMin: 525, body: "Forecast is clear and 72 tonight — we are on" },
      { who: "Elena Moss", agoMin: 432, body: "do i need to bring a partner?" },
      { who: "Hispanic Student Society", agoMin: 425, body: "No — we rotate partners during the lesson. Come alone, you will not be alone long." },
      { who: "Yuki Sato", agoMin: 330, body: "what shoes work best on the grass" },
    ],
  },
  {
    slug: "chess",
    title: "Chess in the Quad",
    category: "social",
    source: "community",
    venueName: "Memorial Circle, south lawn",
    lat: 33.5839,
    lng: -101.87475,
    organizerName: "Otto Lind",
    organizerRole: "Student · Philosophy",
    description:
      "Three boards set up under the trees on the south side of the circle. Winner stays on. Beginners genuinely welcome — half the games today have been teaching games.",
    startOffsetMin: -60,
    endOffsetMin: 120,
    people: ["Otto Lind", "Theo Blake", "Anya Volkov", "Ben Ortiz", "Jules Weber"],
    msgs: [
      { who: "Otto Lind", agoMin: 76, body: "Three boards out, south side under the big trees" },
      { who: "Theo Blake", agoMin: 45, body: "lost twice already, staying anyway" },
      { who: "Anya Volkov", agoMin: 9, body: "one board free right now if anyone is walking by" },
    ],
  },
  {
    slug: "run",
    title: "Sunset Run — 3 Miles",
    category: "sports",
    source: "community",
    venueName: "Urbanovsky Park, north entrance",
    lat: 33.582,
    lng: -101.8827,
    organizerName: "Iris Lang",
    organizerRole: "Student · Nursing",
    description:
      "Easy three miles on the park loop at conversational pace, roughly a ten-minute mile. We regroup at every turn so nobody gets dropped. Stretching after by the north gate.",
    startOffsetMin: 150,
    endOffsetMin: 210,
    people: ["Iris Lang", "Priya Nair", "Devon Clark", "Ravi Shah", "Finn Doyle", "Bea Carver", "Dara Nolan", "Marcus Webb", "Yuki Sato"],
    msgs: [
      { who: "Iris Lang", agoMin: 510, body: "Meeting at the north entrance sign at 6:25" },
      { who: "Ravi Shah", agoMin: 418, body: "what pace are we running" },
      { who: "Iris Lang", agoMin: 406, body: "~10 min/mile, and we regroup at every turn. Nobody gets dropped." },
      { who: "Bea Carver", agoMin: 185, body: "first time joining, is 3 miles doable if i normally do 2" },
    ],
  },
  {
    slug: "photo",
    title: "Golden Hour Photo Walk",
    category: "clubs",
    source: "official",
    venueName: "Media & Communication, front steps",
    lat: 33.58207,
    lng: -101.8804042,
    organizerName: "Texas Tech Photo Club",
    organizerRole: "Registered student organization",
    description:
      "Ninety-minute walk shooting the west side of campus in golden hour light. Any camera counts, phones included. Officers will help with manual settings as we go. We end at the Circle for the sunset.",
    startOffsetMin: 60,
    endOffsetMin: 150,
    people: ["Mei Tanaka", "Hana Fischer", "Zara Ahmed", "Nadia Petrov", "Elena Moss", "Grace Yun", "Jules Weber", "Owen Diaz", "Kai Mensah", "Sasha Kim", "Lena Park"],
    msgs: [
      { who: "Texas Tech Photo Club", agoMin: 540, body: "Meeting on the front steps at 5:25, walking at 5:30 sharp" },
      { who: "Hana Fischer", agoMin: 440, body: "phone cameras ok? do not own a dslr" },
      { who: "Texas Tech Photo Club", agoMin: 433, body: "Completely fine. Half the club shoots on phones." },
      { who: "Kai Mensah", agoMin: 165, body: "route posted anywhere? trying to catch up late" },
    ],
  },
];

async function main() {
  const existingEvents = await prisma.event.count();
  if (existingEvents > 0) {
    console.log(`Seed skipped: ${existingEvents} events already exist.`);
    return;
  }

  const now = Date.now();

  const names = new Set<string>();
  for (const e of EVENTS) {
    e.people.forEach((p) => names.add(p));
    e.msgs.forEach((m) => names.add(m.who));
  }

  const userIds = new Map<string, string>();
  for (const name of names) {
    const u = await prisma.user.create({
      data: { name, avatarColor: avColor(name) },
    });
    userIds.set(name, u.id);
  }

  // The signed-in demo identity ("You"), referenced by the session cookie.
  await prisma.user.create({
    data: { id: "demo-user", name: "You", avatarColor: "#0b1f18" },
  });

  for (const e of EVENTS) {
    const event = await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        description: e.description,
        category: e.category,
        source: e.source,
        startsAt: new Date(now + e.startOffsetMin * MIN),
        endsAt: new Date(now + e.endOffsetMin * MIN),
        venueName: e.venueName,
        lat: e.lat,
        lng: e.lng,
        photoPath: `/photos/${e.slug}.jpg`,
        organizerName: e.organizerName,
        organizerRole: e.organizerRole,
      },
    });

    await prisma.rsvp.createMany({
      data: e.people.map((name) => ({
        eventId: event.id,
        userId: userIds.get(name)!,
      })),
    });

    for (const m of e.msgs) {
      await prisma.message.create({
        data: {
          eventId: event.id,
          userId: userIds.get(m.who)!,
          body: m.body,
          createdAt: new Date(now - m.agoMin * MIN),
        },
      });
    }
  }

  console.log(
    `Seeded ${EVENTS.length} events, ${names.size + 1} users, RSVPs and messages.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
