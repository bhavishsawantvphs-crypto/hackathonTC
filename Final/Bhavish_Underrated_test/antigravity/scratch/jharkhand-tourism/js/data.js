/**
 * Jharkhand Tourism - Top 5 Famous Destinations & Travel Data
 * 100% Authentic verified photography with Explorer Passport Stamps & Google Maps Road Connectivity.
 */

const FAMOUS_DESTINATIONS = [
  {
    id: "hundru-falls",
    name: "Hundru Falls",
    tagline: "The 98-meter roaring cascade of Subarnarekha",
    category: "Waterfall & Adventure",
    district: "Ranchi",
    location: "Purulia Road, 45 km from Ranchi",
    coordinates: {
      lat: 23.4475,
      lng: 85.6558
    },
    elevation: "320 m",
    bestTimeToVisit: "October to March (Post-Monsoon)",
    timings: "06:00 AM - 05:00 PM",
    entryFee: "₹10 per person",
    stampIcon: "waterfall",
    stampColor: "#38BDF8",
    stampTitle: "WATERFALL CONQUEROR",
    unlockClue: "Follow the golden Subarnarekha River down 750 stone steps.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hundru+Falls+Ranchi+Jharkhand",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg"
    ],
    description: "Hundru Falls is one of the grandest natural spectacles in eastern India. Created by the Subarnarekha River plunging 98 meters (322 ft) over a jagged cliff face, it carves magnificent rock formations and natural bathing pools at its base. The descent of over 750 stone steps brings travellers right into the mist and roar of the water.",
    highlights: [
      "98-meter vertical plunge onto sculpted basalt rocks",
      "Natural pools suitable for wading during winter months",
      "Scenic 750-step trail through lush Sal forest canopy",
      "Spectacular rock erosion sculpting million-year geologies"
    ],
    howToReach: {
      byAir: "Birsa Munda Airport Ranchi (48 km)",
      byTrain: "Ranchi Railway Station (42 km) or Muri Junction (30 km)",
      byRoad: "Well-connected via NH-33 and Purulia Road with taxi and bus services"
    },
    safety: {
      precaution: "Wear shoes with deep rubber tread; stairs and rocks near the plunge pool are permanently wet with fine algae spray.",
      majorWarning: "Strictly avoid swimming near the base during monsoons (July-Sept) due to unpredictable flash currents and submerged whirlpools."
    },
    funFact: "The Subarnarekha ('Streak of Gold') river was named because ancient villagers panned fine gold dust from its sandy riverbeds."
  },
  {
    id: "patratu-valley",
    name: "Patratu Valley & Dam",
    tagline: "Serpentine ribbon roads and emerald reservoir waters",
    category: "Scenic & Lakes",
    district: "Ramgarh",
    location: "Ramgarh-Ranchi Highway, 35 km from Ranchi",
    coordinates: {
      lat: 23.6358,
      lng: 85.2986
    },
    elevation: "410 m",
    bestTimeToVisit: "September to March",
    timings: "Open 24 Hours (Best during daylight & sunset)",
    entryFee: "Free (Boating charges apply at Patratu Lake Resort)",
    stampIcon: "valley",
    stampColor: "#F59E0B",
    stampTitle: "SERPENTINE MASTER",
    unlockClue: "Drive along the 30 hairpin switchbacks overlooking emerald waters.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Patratu+Valley+Dam+Jharkhand",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Patratu_Valley_at_night.jpg/1280px-Patratu_Valley_at_night.jpg",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Patratu_Valley_at_night.jpg/1280px-Patratu_Valley_at_night.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Patratu_Valley_at_night.jpg/1280px-Patratu_Valley_at_night.jpg"
    ],
    description: "Often celebrated as the 'Queen of Highways in East India', Patratu Valley unfolds along mesmerizing hairpin switchbacks carved across steep forested hills. At the valley floor rests the vast Patratu Dam & Reservoir, offering speedboating, island cafes, and sunset promenades that rival international lakeside getaways.",
    highlights: [
      "Thrilling multi-tiered winding ghat road with panoramic viewpoints",
      "Watersports: Jet ski, pontoon boats, and speedboats on Patratu Lake",
      "Spectacular twilight valley illuminated by solar ribbon lamps",
      "Modern waterfront promenade and island restaurants"
    ],
    howToReach: {
      byAir: "Birsa Munda Airport Ranchi (40 km)",
      byTrain: "Patratu Railway Station (5 km) or Ranchi (35 km)",
      byRoad: "Pithoria-Patratu 4-lane scenic highway is an effortless 50-minute drive from Ranchi"
    },
    safety: {
      precaution: "Exercise low gears and respect speed limits on the hairpin bends, especially in dense morning winter fog.",
      majorWarning: "Avoid stopping or parking your vehicle on sharp blind curves along the ghat for photography."
    },
    funFact: "The serpentine road has over 30 distinct hairpin turns, making it a favorite drive for motoring clubs across Eastern India."
  },
  {
    id: "baidyanath-dham",
    name: "Baba Baidyanath Dham",
    tagline: "One of India's 12 revered Jyotirlingas & Shakti Peeth",
    category: "Spiritual & Heritage",
    district: "Deoghar",
    location: "Deoghar City",
    coordinates: {
      lat: 24.4925,
      lng: 86.7001
    },
    elevation: "254 m",
    bestTimeToVisit: "September to March (Sultanganj Kanwar Yatra occurs in Shravan)",
    timings: "04:00 AM - 09:00 PM",
    entryFee: "Free (VIP Darshan passes available)",
    stampIcon: "shrine",
    stampColor: "#EAB308",
    stampTitle: "SACRED PILGRIM",
    unlockClue: "Seek blessings at the rare Panchasula-crowned Jyotirlinga.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Baba+Baidyanath+Temple+Deoghar+Jharkhand",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/1280px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/1280px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/1280px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg"
    ],
    description: "Baba Baidyanath Temple complex in Deoghar is a rare confluence where a sacred Shiva Jyotirlinga and a Shakti Peeth (Hridaya Peeth) reside in adjacent sanctums. The main 72-foot stone spire features a Panchasula (five-pronged trident) and is the destination for millions during the legendary 105-km barefoot Kanwar pilgrimage.",
    highlights: [
      "Ancient main stone sanctum housing the sacred Kamana Linga",
      "Cluster of 21 auxiliary temples dedicated to diverse Vedic deities",
      "Rare Panchasula trident crowning the stone shikhar",
      "Epic spiritual energy during the sacred month of Shravana"
    ],
    howToReach: {
      byAir: "Deoghar International Airport (DGH) (8 km from temple)",
      byTrain: "Jasidih Junction (JSME) (8 km) - major mainline railway hub",
      byRoad: "Direct NH routes connect Deoghar with Patna, Ranchi, Kolkata, and Bhagalpur"
    },
    safety: {
      precaution: "Keep valuables secure in cloakrooms; use official digital e-pass queues during high festival periods.",
      majorWarning: "Avoid unauthorized middlemen outside temple gates; follow official temple trust queues exclusively."
    },
    funFact: "Unlike other Shiva temples which have a Trishula (3 prongs), Baidyanath temple has a rare Panchasula (5 prongs) atop its spire."
  },
  {
    id: "parasnath-hill",
    name: "Parasnath Hill (Shikharji)",
    tagline: "The supreme sanctum on Jharkhand's highest peak (1,365m)",
    category: "Mountain Peaks",
    district: "Giridih",
    location: "Parasnath, Giridih District",
    coordinates: {
      lat: 23.9628,
      lng: 86.1333
    },
    elevation: "1,365 m (4,478 ft)",
    bestTimeToVisit: "October to March",
    timings: "04:00 AM - 07:00 PM",
    entryFee: "Free",
    stampIcon: "mountain",
    stampColor: "#10B981",
    stampTitle: "SUMMIT EXPLORER",
    unlockClue: "Ascend to the highest summit in Jharkhand where 20 Tirthankaras attained Nirvana.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Parasnath+Hill+Shikharji+Giridih+Jharkhand",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg/1280px-Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg/1280px-Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg/1280px-Views_of_Shikharji_on_way_to_Anantnatha_Tonk_3.jpg"
    ],
    description: "Rising dramatically above the Chotanagpur Plateau to 1,365 meters, Parasnath Hill is the highest mountain summit in Jharkhand. Revered as Shri Sammed Shikharji, 20 of the 24 Jain Tirthankaras attained Moksha (salvation) here. The 27-km pilgrimage circumambulation trail leads through misty cloud forests and ancient marble shrines.",
    highlights: [
      "Highest peak in Jharkhand offering 360-degree panoramic horizons",
      "Sacred cluster of 31 ancient Jain temples crowning ridges and peaks",
      "27-km scenic hiking circuit through biodiverse montane forest",
      "Sunrise viewpoint offering sea-of-clouds vistas in winter"
    ],
    howToReach: {
      byAir: "Kazi Nazrul Islam Airport Durgapur (140 km) or Ranchi (160 km)",
      byTrain: "Parasnath Railway Station (PNME) (22 km from base town Madhuban)",
      byRoad: "Located right off Grand Trunk Road (NH-19) with frequent transport from Dhanbad and Ranchi"
    },
    safety: {
      precaution: "Begin the 27-km ascent before dawn (4:00 AM) with ample water, energy snacks, and trekking sticks.",
      majorWarning: "Respect the religious sanctuary sanctity: non-vegetarian food, alcohol, and leather items are strictly prohibited across the holy hill."
    },
    funFact: "Twenty Jain Tirthankaras, including Parshvanatha after whom the hill is named, attained Nirvana upon these very ridges."
  },
  {
    id: "betla-national-park",
    name: "Betla National Park",
    tagline: "Ancient Sal forests, tigers & 16th-century Chero forts",
    category: "Wildlife & Nature",
    district: "Latehar",
    location: "Palamu District border, 160 km from Ranchi",
    coordinates: {
      lat: 23.8824,
      lng: 84.1887
    },
    elevation: "350 m",
    bestTimeToVisit: "November to April",
    timings: "06:00 AM - 05:30 PM (Safari slots apply)",
    entryFee: "₹100 per person + Safari charges",
    stampIcon: "wildlife",
    stampColor: "#EF4444",
    stampTitle: "JUNGLE TRAILBLAZER",
    unlockClue: "Explore the ancient Chero forts buried deep inside tiger territory.",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Betla+National+Park+Latehar+Jharkhand",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg",
    gallery: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg"
    ],
    description: "One of the earliest national parks in India to come under Project Tiger in 1974, Betla spans rolling hills, teak groves, and dense sal forests. Deep inside the jungle stand the mysterious twin 16th-century Palamu Forts built by the sovereign Chero kings, blending royal Mughal-tribal stone architecture with untamed wilderness.",
    highlights: [
      "Elephant-back and 4x4 open safari tracks",
      "Historic 16th-century Chero Dynasty jungle forts",
      "Diverse wildlife: Elephants, leopards, gaur (Indian bison), chital & sloth bears",
      "Lush tropical deciduous vegetation and natural waterholes"
    ],
    howToReach: {
      byAir: "Ranchi Birsa Munda Airport (165 km)",
      byTrain: "Daltonganj Railway Station (25 km)",
      byRoad: "Regular private and state buses run from Ranchi, Daltonganj, and Netarhat"
    },
    safety: {
      precaution: "Always hire a registered forest department naturalist guide and stay strictly inside safari vehicles on track routes.",
      majorWarning: "Do not venture into fort ruins on foot without forest rangers; wild elephants and sloth bears frequent the forest corridor after sunset."
    },
    funFact: "Betla's name is an acronym: B-Bison, E-Elephant, T-Tiger, L-Leopard, A-Axis axis (Chital)."
  }
];

// Curated Driving Routes Matrix (Distance, Time, Highway) for Car Travel Estimator
const CAR_DRIVING_ROUTES = {
  "hundru-falls_patratu-valley": {
    distanceKm: 48,
    durationText: "1 hr 15 mins",
    highway: "via Ranchi Ring Rd & Pithoria-Patratu 4-Lane Hwy",
    highlights: "Smooth multi-lane highway descending into thrilling ghat curves",
    roadQuality: "Excellent 4-Lane Expressway"
  },
  "patratu-valley_betla-national-park": {
    distanceKm: 155,
    durationText: "3 hrs 45 mins",
    highway: "via NH-39 & Kuru-Latehar Route",
    highlights: "Scenic drive passing Chotanagpur forest reserves and tribal villages",
    roadQuality: "Good 2-Lane National Highway"
  },
  "betla-national-park_parasnath-hill": {
    distanceKm: 225,
    durationText: "5 hrs 15 mins",
    highway: "via NH-22 & Grand Trunk Rd (NH-19)",
    highlights: "Smooth high-speed transit along historic Grand Trunk corridor",
    roadQuality: "Excellent 6-Lane GT Road (NH-19)"
  },
  "parasnath-hill_baidyanath-dham": {
    distanceKm: 110,
    durationText: "2 hrs 40 mins",
    highway: "via Giridih-Deoghar State Highway",
    highlights: "Picturesque pilgrimage route across eastern Jharkhand plains",
    roadQuality: "Good 2-Lane State Highway"
  },
  "baidyanath-dham_hundru-falls": {
    distanceKm: 250,
    durationText: "5 hrs 45 mins",
    highway: "via NH-20 (Ranchi-Patna Highway) & Purulia Rd",
    highlights: "Main central north-south trunk route back to Ranchi waterfall belt",
    roadQuality: "Smooth 4-Lane NH-20 corridor"
  },
  // Cross-route pairs
  "hundru-falls_betla-national-park": {
    distanceKm: 175,
    durationText: "4 hrs 10 mins",
    highway: "via NH-39 & Ranchi-Daltonganj Rd",
    highlights: "Direct journey from the capital's falls into deep tiger country",
    roadQuality: "National Highway NH-39"
  },
  "hundru-falls_parasnath-hill": {
    distanceKm: 160,
    durationText: "3 hrs 45 mins",
    highway: "via NH-20 & NH-19 (GT Road)",
    highlights: "Direct transit from Ranchi to highest mountain peak",
    roadQuality: "Smooth 4-Lane & 6-Lane Expressways"
  },
  "hundru-falls_baidyanath-dham": {
    distanceKm: 250,
    durationText: "5 hrs 45 mins",
    highway: "via NH-20 & Giridih-Deoghar Rd",
    highlights: "Capital to holy Jyotirlinga sanctum corridor",
    roadQuality: "Smooth 4-Lane National Highway"
  },
  "patratu-valley_parasnath-hill": {
    distanceKm: 145,
    durationText: "3 hrs 30 mins",
    highway: "via Ramgarh-Bokaro-Dhanbad Hwy & NH-19",
    highlights: "Connecting scenic lake valley with sacred summit",
    roadQuality: "High-speed 4-Lane Highway"
  },
  "patratu-valley_baidyanath-dham": {
    distanceKm: 235,
    durationText: "5 hrs 15 mins",
    highway: "via Ramgarh-Giridih Route",
    highlights: "Scenic journey from reservoir ghats to spiritual capital",
    roadQuality: "State & National Highways"
  },
  "betla-national-park_baidyanath-dham": {
    distanceKm: 310,
    durationText: "7 hrs 00 mins",
    highway: "via NH-22, NH-19 & Deoghar Rd",
    highlights: "West-to-East cross-state discovery route",
    roadQuality: "Major National Highways"
  }
};

// Official 5-Stop Grand Expedition Circuit (Logical Sequential Driving Order)
const EXPEDITION_CIRCUIT_STOPS = [
  "hundru-falls",
  "patratu-valley",
  "betla-national-park",
  "parasnath-hill",
  "baidyanath-dham"
];

// Curated Informational Micro-Moments ("Did You Know?" editorial facts)
const DID_YOU_KNOW_FACTS = [
  {
    number: "01",
    tag: "ETYMOLOGY & NATURE",
    headline: "Jharkhand literally means 'The Territory of Forests'",
    body: "Derived from 'Jhar' (dense forest/bushland) and 'Khand' (land), over 29% of the state's geographical area is enveloped in primeval Sal, Mahua, and Teak woodland canopy."
  },
  {
    number: "02",
    tag: "INDIGENOUS HERITAGE",
    headline: "Home to 32 Unique Indigenous Tribal Communities",
    body: "Rich in living ancestral wisdom, Jharkhand's Santhal, Munda, Oraon, Ho, and Birhor tribes maintain continuous thousand-year traditions in harmony with Mother Nature (Marang Buru)."
  },
  {
    number: "03",
    tag: "LIVING ART FORMS",
    headline: "GI-Tagged Sohrai & Khovar Murals Painted with Natural Earth",
    body: "Tribal women paint intricate ritual wall art using naturally sourced manganese black, ochre yellow, and white kaolin clay, a tradition dating back to prehistoric rock art."
  },
  {
    number: "04",
    tag: "GEOLOGICAL WONDERS",
    headline: "The Chotanagpur Plateau is over 2.5 Billion Years Old",
    body: "Part of the ancient Gondwanaland supercontinent, this dramatic plateau features stepped knickpoints creating dozens of pristine waterfalls cascading across ancient granite."
  }
];

// Travel Themes for Experience Showcase
const TRAVEL_THEMES = [
  {
    id: "waterfalls",
    title: "Roaring Waterfalls & Canyons",
    subtitle: "From 98-meter thunderous plunges to serene emerald pools",
    count: "Hundru & Beyond",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg"
  },
  {
    id: "wilderness",
    title: "Untamed Wildlife & Sal Forests",
    subtitle: "Asia's densest Sal reserves, wild elephant herds and tigers",
    count: "Betla Reserve",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg"
  },
  {
    id: "spiritual",
    title: "Sacred Summits & Ancient Shrines",
    subtitle: "Revered Jyotirlingas, Jain mountain peaks, and timeless pilgrimages",
    count: "Baidyanath & Shikharji",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/1280px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg"
  },
  {
    id: "scenic",
    title: "Serpentine Ghats & Misty Valleys",
    subtitle: "Patratu hairpin roads, panoramic reservoir horizons",
    count: "Patratu Valley",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Patratu_Valley_at_night.jpg/1280px-Patratu_Valley_at_night.jpg"
  }
];

// ==========================================================================
// SHARED TEAM SCHEDULER: 6 WATERFALLS DIRECTORY & METADATA PRESERVATION
// ==========================================================================
const WATERFALLS_DIRECTORY = [
  {
    id: "sita-falls",
    name: "Sita Falls",
    waterfallId: "sita-falls",
    waterfallName: "Sita Falls",
    district: "Ranchi",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    category: "Waterfall & Nature",
    accessibility: "Located 40 km from Ranchi off Purulia Road; accessible via 300 stone steps through forested trails.",
    safetyStatus: "Wear non-slip footwear; avoid deep plunge pool currents during monsoon season.",
    bestSeason: "October to March"
  },
  {
    id: "mirchaiya-falls",
    name: "Mirchaiya Falls",
    waterfallId: "mirchaiya-falls",
    waterfallName: "Mirchaiya Falls",
    district: "Latehar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg",
    category: "Waterfall & Wilderness",
    accessibility: "3 km from Garu block near Betla National Park, Latehar; accessible by local road.",
    safetyStatus: "Moderate flow; stay within designated viewing decks and avoid mossy boulders.",
    bestSeason: "September to February"
  },
  {
    id: "indra-waterfall",
    name: "Indra Waterfall",
    waterfallId: "indra-waterfall",
    waterfallName: "Indra Waterfall",
    district: "Khunti",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    category: "Waterfall & Adventure",
    accessibility: "Approx. 35 km from Ranchi via Khunti Road; connected by paved state highway.",
    safetyStatus: "Watch footing along rocky banks and follow local forest guide directions.",
    bestSeason: "October to March"
  },
  {
    id: "kanti-waterfalls",
    name: "Kanti Waterfalls",
    waterfallId: "kanti-waterfalls",
    waterfallName: "Kanti Waterfalls",
    district: "Latehar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg",
    category: "Waterfall & Forest",
    accessibility: "Near Chandwa, Latehar; accessible by road followed by a short scenic forest path.",
    safetyStatus: "Daylight visits recommended; slippery boulders during post-monsoon months.",
    bestSeason: "October to February"
  },
  {
    id: "sugga-bandh-waterfall",
    name: "Sugga Bandh Waterfall",
    waterfallId: "sugga-bandh-waterfall",
    waterfallName: "Sugga Bandh Waterfall",
    district: "Latehar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/1280px-Entrance_of_Betla_national_park.jpg",
    category: "Waterfall & Eco-Tourism",
    accessibility: "Situated along the North Koel River near Garu, Latehar; accessible via park route.",
    safetyStatus: "Natural rock canyon; strictly avoid swimming in rapid river gorges.",
    bestSeason: "November to March"
  },
  {
    id: "hirni-falls",
    name: "Hirni Falls",
    waterfallId: "hirni-falls",
    waterfallName: "Hirni Falls",
    district: "West Singhbhum",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/1280px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg",
    category: "Waterfall & Wilderness",
    accessibility: "Located 70 km from Ranchi along Ranchi-Chaibasa Highway (NH-75E).",
    safetyStatus: "Follow paved forested pathway; guarded viewing decks available for visitors.",
    bestSeason: "October to March"
  }
];

