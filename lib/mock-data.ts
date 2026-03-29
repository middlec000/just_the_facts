import { User, Statement, Argument, Evidence } from "./types";

export const users: User[] = [
  { id: "user-1", name: "Dr. Sarah Chen" },
  { id: "user-2", name: "Alex Rivera" },
];

export const statements: Statement[] = [
  {
    id: "stmt-1",
    text: "Humans have landed on the Moon",
    tags: ["space", "history", "science"],
    upvotes: 12,
    downvotes: 2,
    userId: "user-1",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "stmt-2",
    text: "Regular physical exercise reduces the risk of cardiovascular disease",
    tags: ["health", "science", "medicine"],
    upvotes: 8,
    downvotes: 1,
    userId: "user-2",
    createdAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "stmt-3",
    text: "Social media use is linked to increased rates of anxiety in teenagers",
    tags: ["health", "technology", "society"],
    upvotes: 15,
    downvotes: 4,
    userId: "user-1",
    createdAt: "2025-02-10T10:00:00Z",
  },
];

export const arguments_: Argument[] = [
  // --- FOR ---
  {
    id: "arg-1",
    statementId: "stmt-1",
    stance: "for",
    title: "Apollo mission records and physical evidence",
    summary:
      "NASA's Apollo program conducted six crewed Moon landings between 1969 and 1972, documented by thousands of photographs, hours of video footage, and 382 kilograms of lunar samples returned to Earth.",
    upvotes: 24,
    downvotes: 1,
    userId: "user-1",
    createdAt: "2025-01-16T08:00:00Z",
  },
  {
    id: "arg-2",
    statementId: "stmt-1",
    stance: "for",
    title: "Independent verification by other nations",
    summary:
      "Multiple countries including the Soviet Union, Japan, China, and India have independently confirmed the Apollo landing sites using their own lunar orbiters.",
    upvotes: 18,
    downvotes: 0,
    userId: "user-2",
    createdAt: "2025-01-16T09:00:00Z",
  },
  {
    id: "arg-3",
    statementId: "stmt-1",
    stance: "for",
    title: "Lunar laser ranging experiments",
    summary:
      "Retroreflector arrays left on the Moon by Apollo 11, 14, and 15 are still used by observatories worldwide to measure the Earth-Moon distance with millimeter precision.",
    upvotes: 21,
    downvotes: 2,
    userId: "user-1",
    createdAt: "2025-01-16T10:00:00Z",
  },
  {
    id: "arg-4",
    statementId: "stmt-1",
    stance: "for",
    title: "Testimony of hundreds of thousands of workers",
    summary:
      "Over 400,000 engineers, scientists, and technicians worked on the Apollo program. No credible whistleblower has ever come forward to claim the missions were fabricated.",
    upvotes: 16,
    downvotes: 3,
    userId: "user-2",
    createdAt: "2025-01-16T11:00:00Z",
  },
  // --- AGAINST ---
  {
    id: "arg-5",
    statementId: "stmt-1",
    stance: "against",
    title: "Photographic anomalies in NASA imagery",
    summary:
      "Critics point to perceived inconsistencies in Apollo photographs, including the absence of stars in the lunar sky, seemingly anomalous shadow directions, and the behavior of the American flag.",
    upvotes: 5,
    downvotes: 14,
    userId: "user-2",
    createdAt: "2025-01-17T08:00:00Z",
  },
  {
    id: "arg-6",
    statementId: "stmt-1",
    stance: "against",
    title: "Van Allen radiation belt danger",
    summary:
      "Some skeptics argue that the Van Allen radiation belts surrounding Earth would have delivered a lethal dose of radiation to the astronauts during transit.",
    upvotes: 4,
    downvotes: 11,
    userId: "user-1",
    createdAt: "2025-01-17T09:00:00Z",
  },
  {
    id: "arg-7",
    statementId: "stmt-1",
    stance: "against",
    title: "Cold War geopolitical motive to fabricate",
    summary:
      "The United States had an enormous political incentive to win the Space Race against the Soviet Union, which some argue provided sufficient motive to stage a landing if it could not be achieved.",
    upvotes: 7,
    downvotes: 9,
    userId: "user-2",
    createdAt: "2025-01-17T10:00:00Z",
  },
];

export const evidence: Evidence[] = [
  // Evidence for arg-1 (Apollo records)
  {
    id: "ev-1",
    argumentId: "arg-1",
    title: "NASA Apollo 11 Mission Report",
    description:
      "The complete official mission report for Apollo 11, documenting every phase of the mission from launch to splashdown.",
    sourceUrl: "https://www.nasa.gov/mission/apollo-11/",
    sourceType: "official",
    userId: "user-1",
    createdAt: "2025-01-18T08:00:00Z",
  },
  {
    id: "ev-2",
    argumentId: "arg-1",
    title: "Lunar sample analysis by global laboratories",
    description:
      "Peer-reviewed studies of Apollo lunar samples conducted by independent laboratories in multiple countries, confirming their extraterrestrial origin.",
    sourceUrl: "https://curator.jsc.nasa.gov/lunar/",
    sourceType: "study",
    userId: "user-2",
    createdAt: "2025-01-18T09:00:00Z",
  },
  // Evidence for arg-2 (Independent verification)
  {
    id: "ev-3",
    argumentId: "arg-2",
    title: "JAXA SELENE (Kaguya) terrain camera confirmation",
    description:
      "Japan's SELENE orbiter photographed the Apollo 15 landing site halo, consistent with rocket exhaust disturbance of the lunar regolith.",
    sourceUrl: "https://www.jaxa.jp/projects/sat/selene/",
    sourceType: "study",
    userId: "user-1",
    createdAt: "2025-01-18T10:00:00Z",
  },
  {
    id: "ev-4",
    argumentId: "arg-2",
    title: "LRO photographs of Apollo landing sites",
    description:
      "NASA's Lunar Reconnaissance Orbiter captured high-resolution images showing Apollo hardware, astronaut tracks, and rover trails on the lunar surface.",
    sourceUrl: "https://www.nasa.gov/mission/lro/",
    sourceType: "official",
    userId: "user-2",
    createdAt: "2025-01-18T11:00:00Z",
  },
  // Evidence for arg-3 (Laser ranging)
  {
    id: "ev-5",
    argumentId: "arg-3",
    title: "Apache Point Observatory lunar laser-ranging operation",
    description:
      "Ongoing experiment using retroreflectors placed by Apollo missions to measure Earth-Moon distance, published in peer-reviewed journals.",
    sourceUrl: "https://physics.ucsd.edu/~tmurphy/apollo/apollo.html",
    sourceType: "study",
    userId: "user-1",
    createdAt: "2025-01-18T12:00:00Z",
  },
  // Evidence for arg-4 (Workforce testimony)
  {
    id: "ev-6",
    argumentId: "arg-4",
    title: "Oral histories from Apollo program workers",
    description:
      "The Johnson Space Center Oral History Project contains hundreds of firsthand accounts from Apollo-era engineers and astronauts.",
    sourceUrl: "https://www.jsc.nasa.gov/history/oral_histories/",
    sourceType: "official",
    userId: "user-2",
    createdAt: "2025-01-18T13:00:00Z",
  },
  // Evidence for arg-5 (Photo anomalies)
  {
    id: "ev-7",
    argumentId: "arg-5",
    title: "Analysis of shadow directions in Apollo photos",
    description:
      "A compilation of Apollo photographs where shadows appear to point in multiple directions, which some interpret as evidence of artificial studio lighting.",
    sourceUrl: "https://example.com/shadow-analysis",
    sourceType: "article",
    userId: "user-2",
    createdAt: "2025-01-19T08:00:00Z",
  },
  {
    id: "ev-8",
    argumentId: "arg-5",
    title: "Absence of stars in Apollo lunar photographs",
    description:
      "None of the Apollo surface photographs show stars in the sky, which skeptics argue is inconsistent with the airless lunar environment.",
    sourceUrl: "https://example.com/no-stars",
    sourceType: "article",
    userId: "user-1",
    createdAt: "2025-01-19T09:00:00Z",
  },
  // Evidence for arg-6 (Van Allen belts)
  {
    id: "ev-9",
    argumentId: "arg-6",
    title: "Radiation dose estimates for Van Allen belt transit",
    description:
      "Calculations by skeptics suggesting that transit through the Van Allen belts would have exposed astronauts to dangerous levels of ionizing radiation.",
    sourceUrl: "https://example.com/van-allen-radiation",
    sourceType: "article",
    userId: "user-2",
    createdAt: "2025-01-19T10:00:00Z",
  },
  // Evidence for arg-7 (Geopolitical motive)
  {
    id: "ev-10",
    argumentId: "arg-7",
    title: "Kennedy's 1961 Moon speech and Cold War context",
    description:
      "President Kennedy's 1961 address to Congress framing the Moon landing as essential to national prestige and Cold War competition.",
    sourceUrl: "https://www.jfklibrary.org/learn/about-jfk/historic-speeches",
    sourceType: "official",
    userId: "user-1",
    createdAt: "2025-01-19T11:00:00Z",
  },
];

// --- Helper functions ---

export function getStatementById(id: string): Statement | undefined {
  return statements.find((s) => s.id === id);
}

export function getArgumentsByStatementId(statementId: string): Argument[] {
  return arguments_.filter((a) => a.statementId === statementId);
}

export function getArgumentById(id: string): Argument | undefined {
  return arguments_.find((a) => a.id === id);
}

export function getEvidenceByArgumentId(argumentId: string): Evidence[] {
  return evidence.filter((e) => e.argumentId === argumentId);
}

export function getStatementForArgument(
  argumentId: string,
): Statement | undefined {
  const arg = getArgumentById(argumentId);
  if (!arg) return undefined;
  return getStatementById(arg.statementId);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/** Returns every unique tag used across all statements, sorted alphabetically. */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  statements.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
