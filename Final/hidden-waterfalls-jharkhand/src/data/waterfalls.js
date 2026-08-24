// Verified dataset — Hidden & Lesser-Known Waterfalls of Jharkhand
// Exactly 6 curated waterfalls with exact user-supplied image mapping

export const WATERFALLS = [
  {
    id: 'sita-falls',
    name: 'Sita Falls',
    district: 'Ranchi',
    nearbyTown: 'Jonha / Bundu area, ~40 km from Ranchi',
    category: 'Hidden Gem / Eco-Adventure',
    categoryKey: 'gem',
    image: './images/sita-falls.jpg',
    imageDesc: 'Wide rocky multi-tier waterfall',
    span: 6,
    shortDesc: 'One of the lesser-known waterfalls of Jharkhand, surrounded by a natural forest setting and suitable for an offbeat nature experience.',
    fullDesc: 'One of the lesser-known waterfalls of Jharkhand, Sita Falls is surrounded by a natural forest setting and suitable for an offbeat nature experience on the Ranchi–Purulia route. Tucked away from primary high-density visitor circuits, it features rock terraces and natural flowing streams.',
    safetyStatus: 'suitable',
    safetyLabel: '🟢 Suitable / Normal',
    safetyBadge: 'safe',
    safetyNote: 'Accessible under normal weather conditions. Exercise caution around wet, algae-covered boulders and during sudden rainfall or thunderstorm activity.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Easy to Moderate',
    accessibilityCategory: 'easy',
    accessibilityDetails: {
      roadCondition: 'Paved motorable road up to the Jonha approach area with connecting local road.',
      walkingDistance: 'Approx. 400–600 metres walking path from the parking area.',
      trekRequirement: 'Mild descent with rustic stone/cement steps; standard footwear suitable.',
      terrainDifficulty: 'Gentle slope; boulders become slippery when wet.'
    },
    medicalSupport: {
      facility: 'CHC Bundu / Ranchi District Medical Facilities',
      distance: 'Approx. 15–20 km (Bundu) / 40 km (Ranchi)',
      emergencyNotes: 'Basic first aid available at nearby local outposts; emergency medical transport via 108.'
    },
    bestSeason: {
      recommended: 'October to February (Post-monsoon & Winter)',
      seasonalNote: 'Post-monsoon water flow is clean with vibrant surrounding forest vegetation. Winter provides pleasant daytime temperatures.',
      monsoonCaution: 'Avoid stepping into the riverbed or near steep rock ledges during heavy downpours.'
    },
    routeInfo: {
      location: 'Near Jonha, Ranchi District, Jharkhand',
      howToReach: 'Accessible by road via NH320 (Ranchi–Purulia Highway). Nearest railway station is Jonha (~5 km).',
      nearbyTown: 'Ranchi (~40 km) / Bundu (~20 km)',
      approxDistance: '~40 km from Ranchi city center',
      travelTime: 'Approx. 1 hour 15 minutes by car',
      mapQuery: 'Sita Falls Ranchi Jharkhand'
    },
    nearbyExperiences: [
      { type: 'Nature Destination', name: 'Jonha Valley Area', dist: '6 km', desc: 'Scenic plateau views and natural forest surroundings.' },
      { type: 'Local Food', name: 'Dhuska & Chana Ghugni', dist: 'Highway junction', desc: 'Traditional rice-lentil savoury snack served with spiced gram curry.' },
      { type: 'Tribal Craft', name: 'Bamboo & Wooden Artifacts', dist: 'Bundu market area', desc: 'Handcrafted bamboo utility baskets and wooden home craft items.' },
      { type: 'Accommodation', name: 'Local Guesthouses & Eco-Stays', dist: 'Ranchi / Jonha circuit', desc: 'Guesthouse and eco-stay options across the district corridor.' }
    ],
    responsibleTourism: [
      'Carry back all plastic packaging and waste (Leave No Trace).',
      'Do not carve on rocks or damage riparian forest vegetation.',
      'Refrain from playing loud music or disturbing natural wildlife.',
      'Respect local communities and seek permission before taking photographs.',
      'Use reusable water bottles and minimize single-use plastics.',
      'Support local village stalls and regional artisans.'
    ],
    ecoScore: {
      score: 88,
      label: 'Prototype Eco-Score',
      verdict: 'High Environmental Preservation',
      criteria: {
        wasteManagement: '85% (Community collection initiatives)',
        basicFacilities: '80% (Designated parking & approach)',
        environmentalSensitivity: '95% (Dense native canopy intact)',
        localParticipation: '90% (Local guides & village stalls)',
        safety: '90% (Designated viewing perimeter)'
      }
    },
    accent: '#176B45',
    x: 54,
    y: 56
  },
  {
    id: 'mirchaiya-falls',
    name: 'Mirchaiya Falls',
    district: 'Latehar',
    nearbyTown: 'Garu Village, ~3 km away',
    category: 'Eco-Adventure / Nature',
    categoryKey: 'eco',
    image: './images/mirchaiya-falls.jpg',
    imageDesc: 'Twin-stream waterfall with green pool',
    span: 6,
    shortDesc: 'A scenic waterfall near Garu in the Latehar region, set within a natural landscape and suitable for an offbeat nature-focused trip.',
    fullDesc: 'A scenic waterfall near Garu in the Latehar region, Mirchaiya Falls is set within a natural landscape and suitable for an offbeat nature-focused trip. Located in the forested buffer area of the district, it offers a peaceful ambiance and approachable walking trails.',
    safetyStatus: 'suitable',
    safetyLabel: '🟢 Suitable / Normal',
    safetyBadge: 'safe',
    safetyNote: 'Gentle water levels and manageable village trail access under normal conditions. Stay alert for seasonal water level changes during heavy monsoon months.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Easy',
    accessibilityCategory: 'easy',
    accessibilityDetails: {
      roadCondition: 'Paved village road from Garu market area.',
      walkingDistance: 'Approx. 250 metres flat forest trail from the road terminus.',
      trekRequirement: 'Minimal trek requirement; gentle walking pathway.',
      terrainDifficulty: 'Flat forest ground with minor natural stones; straightforward walking.'
    },
    medicalSupport: {
      facility: 'Garu Primary Health Centre (PHC)',
      distance: 'Approx. 3 km in Garu block center',
      emergencyNotes: 'Sub-divisional and district hospital facilities available at Latehar (~38 km).'
    },
    bestSeason: {
      recommended: 'September to March (Post-monsoon to Early Summer)',
      seasonalNote: 'Pleasant forest climate, clear flowing stream water, and comfortable daytime conditions.',
      monsoonCaution: 'Standard caution advised during open-forest thunderstorm activity and sudden water surges.'
    },
    routeInfo: {
      location: 'Near Garu, Latehar District, Jharkhand',
      howToReach: 'Road connectivity from Daltonganj (Medininagar) and Latehar to Garu via Betla route, followed by local approach.',
      nearbyTown: 'Garu (~3 km) / Latehar (~38 km) / Daltonganj (~55 km)',
      approxDistance: '~38 km from Latehar town',
      travelTime: 'Approx. 50 minutes from Latehar',
      mapQuery: 'Mirchaiya Falls Garu Latehar Jharkhand'
    },
    nearbyExperiences: [
      { type: 'Nature Destination', name: 'Betla Forest Area', dist: '28 km', desc: 'Dense forest reserve landscape and historic fort structures.' },
      { type: 'River Confluence', name: 'Kechki Sangam', dist: '32 km', desc: 'Scenic meeting point of the Auranga and North Koel rivers.' },
      { type: 'Stay', name: 'Village Homestays', dist: 'Garu area', desc: 'Local rural hospitality with traditional home-cooked meals.' },
      { type: 'Local Food', name: 'Thekua & Regional Savouries', dist: 'Garu market', desc: 'Traditional homemade snacks prepared from local grains.' }
    ],
    responsibleTourism: [
      'Maintain quietness near wildlife corridors and forest areas.',
      'Refrain from single-use plastics; carry all items back.',
      'Support local community guides and family-run food stalls.',
      'Respect village water bodies and agricultural channels downstream.'
    ],
    ecoScore: {
      score: 91,
      label: 'Prototype Eco-Score',
      verdict: 'Exemplary Village Eco-Tourism Spot',
      criteria: {
        wasteManagement: '90% (Zero-plastic community norm)',
        basicFacilities: '82% (Village trail & parking point)',
        environmentalSensitivity: '96% (Forest buffer sanctuary)',
        localParticipation: '94% (Village committee stewardship)',
        safety: '93% (Gentle depth & low-hazard banks)'
      }
    },
    accent: '#176B45',
    x: 28,
    y: 44
  },
  {
    id: 'sugga-bandh-waterfall',
    name: 'Sugga Bandh Waterfall',
    district: 'Latehar',
    nearbyTown: 'Near Baresand / Mahuadanr Valley, Latehar',
    category: 'Nature / Eco-Adventure',
    categoryKey: 'eco',
    image: './images/suga-bandh-falls.jpg',
    imageDesc: 'Broad waterfall flowing over large rocks',
    span: 6,
    shortDesc: 'A waterfall destination near Baresand in the Latehar region, surrounded by a forested landscape and suitable for a nature-focused getaway.',
    fullDesc: 'A waterfall destination near Baresand in the Latehar region, Sugga Bandh Waterfall is surrounded by a forested landscape and suitable for a nature-focused getaway. Positioned along the scenic riverine landscape between Netarhat and Baresand, it combines rocky cascades with dense forest surroundings.',
    safetyStatus: 'caution',
    safetyLabel: '🟡 Caution',
    safetyBadge: 'caution',
    safetyNote: 'Rocky riverbed with fast-moving water sections during peak flow. Visitors should observe from stable vantage points and avoid deep channels.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Moderate',
    accessibilityCategory: 'moderate',
    accessibilityDetails: {
      roadCondition: 'Forest road connecting Mahuadanr and Baresand; scenic but can be winding.',
      walkingDistance: 'Approx. 300–450 metres from the parking clearing.',
      trekRequirement: 'Gentle walk down rocky forest banks to reach the viewpoint.',
      terrainDifficulty: 'Rocky terrain with riverine boulders; requires careful footing.'
    },
    medicalSupport: {
      facility: 'Mahuadanr Community Health Centre (CHC)',
      distance: 'Approx. 18–22 km via Baresand road',
      emergencyNotes: 'Forest beat station and local administrative post available at Baresand.'
    },
    bestSeason: {
      recommended: 'October to February (Post-monsoon & Winter)',
      seasonalNote: 'Scenic river volume and pleasant cool highland climate.',
      monsoonCaution: 'High water surges during active monsoon rainfall; riverbed wading restricted.'
    },
    routeInfo: {
      location: 'Near Baresand, Latehar District, Jharkhand',
      howToReach: 'Accessible via road from Mahuadanr or Netarhat through the Baresand forest corridor.',
      nearbyTown: 'Baresand (~6 km) / Mahuadanr (~20 km) / Netarhat (~35 km)',
      approxDistance: '~95 km from Latehar / ~35 km from Netarhat',
      travelTime: 'Approx. 1 hour drive from Netarhat',
      mapQuery: '23.574250346948663,84.10041825389098 (Sugga Bandh Waterfall Latehar Jharkhand)'
    },
    nearbyExperiences: [
      { type: 'Hill Station', name: 'Netarhat Plateau', dist: '35 km', desc: 'Pine forests, Magnolia Sunset Point, and Sunrise Point.' },
      { type: 'Wildlife Sanctuary', name: 'Mahuadanr Wolf Sanctuary', dist: '22 km', desc: 'India’s dedicated sanctuary for Indian wolf conservation.' },
      { type: 'River Spot', name: 'North Koel River Banks', dist: 'Baresand area', desc: 'Scenic riverbank views and pristine forest vistas.' },
      { type: 'Local Food', name: 'Netarhat Organic Pears & Farm Produce', dist: 'Netarhat', desc: 'Seasonal local fruits, honey, and traditional highland cuisine.' }
    ],
    responsibleTourism: [
      'Strictly avoid throwing plastic or glass bottles into the river basin.',
      'Stay away from rapid mid-stream currents and deep water channels.',
      'Complete travel during daylight hours in remote forest corridors.',
      'Support local village tea kiosks and rural homestay operators.'
    ],
    ecoScore: {
      score: 83,
      label: 'Prototype Eco-Score',
      verdict: 'High Biodiversity River Reserve',
      criteria: {
        wasteManagement: '78% (Self-cleanup required)',
        basicFacilities: '80% (Rustic viewing points)',
        environmentalSensitivity: '95% (Rich riverine wildlife habitat)',
        localParticipation: '82% (Forest guides and local kiosks)',
        safety: '80% (Caution needed near rocky currents)'
      }
    },
    accent: '#E5A72F',
    x: 24,
    y: 52
  },
  {
    id: 'kanti-waterfalls',
    name: 'Kanti Waterfalls',
    district: 'Latehar',
    nearbyTown: 'Near Kuru Block border, Latehar',
    category: 'Nature / Forest Escape',
    categoryKey: 'nature',
    image: './images/kanti-waterfalls.jpg',
    imageDesc: 'Large white cascade through dark rocks',
    span: 6,
    shortDesc: 'A waterfall surrounded by dense forest near Kuru block, offering a scenic offbeat nature experience.',
    fullDesc: 'A waterfall surrounded by dense forest near Kuru block, Kanti Waterfalls offers a scenic offbeat nature experience. Nestled amidst mixed deciduous forest cover in eastern Latehar, the cascade flows over rocky outcrops creating a refreshing natural atmosphere.',
    safetyStatus: 'suitable',
    safetyLabel: '🟢 Suitable / Normal',
    safetyBadge: 'safe',
    safetyNote: 'Generally calm during post-monsoon and winter months. Slippery natural rocks near the base require steady footing.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Moderate',
    accessibilityCategory: 'moderate',
    accessibilityDetails: {
      roadCondition: 'State highway connectivity toward Kuru border with connecting forest road.',
      walkingDistance: 'Approx. 500 metres walk from vehicle drop point.',
      trekRequirement: 'Short natural trail walk with gentle rock navigation.',
      terrainDifficulty: 'Rocky natural path with woodland roots; sturdy shoes advised.'
    },
    medicalSupport: {
      facility: 'Kuru Community Health Centre (CHC) / Latehar Hospital',
      distance: 'Approx. 12–18 km from site',
      emergencyNotes: 'Emergency medical assistance available from Kuru and Latehar medical units.'
    },
    bestSeason: {
      recommended: 'October to March (Autumn, Winter & Early Spring)',
      seasonalNote: 'Pleasant weather and clear water flows amidst shaded forest canopies.',
      monsoonCaution: 'Watch for slippery rock shelves during rainy intervals.'
    },
    routeInfo: {
      location: 'Near Kuru border, Latehar District, Jharkhand',
      howToReach: 'Accessible via Ranchi–Latehar highway (NH39) turning toward the Kuru approach road.',
      nearbyTown: 'Kuru (~12 km) / Latehar (~28 km) / Ranchi (~68 km)',
      approxDistance: '~28 km from Latehar town',
      travelTime: 'Approx. 40 minutes drive from Latehar',
      mapQuery: '23.59901276328387,84.84311500732223 (Kanti Waterfalls Latehar Jharkhand)'
    },
    nearbyExperiences: [
      { type: 'Scenic Nature', name: 'Kuru Forest Ridge', dist: '8 km', desc: 'Panoramic views across the Chota Nagpur highland boundary.' },
      { type: 'Local Food', name: 'Dhuska & Local Tea Kiosks', dist: 'Highway stops', desc: 'Fresh regional tea and savoury fried rice-lentil snacks.' },
      { type: 'Craft Stop', name: 'Regional Bamboo Craft', dist: 'Local market', desc: 'Traditional woven baskets and eco-friendly handicrafts.' },
      { type: 'Nature Circuit', name: 'Tattapani Hot Spring', dist: '35 km', desc: 'Natural geothermal sulfur hot spring in Latehar district.' }
    ],
    responsibleTourism: [
      'Preserve the natural tranquility of the forest environment.',
      'Deposit all garbage in personal bags and dispose in town bins.',
      'Do not use chemical soaps or detergents in the waterfall stream.',
      'Encourage local community vendors by purchasing regional snacks.'
    ],
    ecoScore: {
      score: 85,
      label: 'Prototype Eco-Score',
      verdict: 'Well-Preserved Forest Stream',
      criteria: {
        wasteManagement: '82% (Visitor self-cleanup practices)',
        basicFacilities: '78% (Natural trail approach)',
        environmentalSensitivity: '94% (Dense tree canopy and riparian flora)',
        localParticipation: '84% (Local community engagement)',
        safety: '86% (Low water hazard in standard seasons)'
      }
    },
    accent: '#4FAF5B',
    x: 36,
    y: 50
  },
  {
    id: 'hirni-falls',
    name: 'Hirni Falls',
    district: 'West Singhbhum',
    nearbyTown: 'Ranchi–Chakradharpur route / Bandgaon',
    category: 'Nature / Forest Cascade',
    categoryKey: 'nature',
    image: './images/hirni-falls.jpg',
    imageDesc: 'Forest waterfall over a rocky slope',
    span: 6,
    shortDesc: 'A tranquil waterfall surrounded by dense forests, located on the Ranchi–Chakradharpur route and suited for a peaceful nature visit.',
    fullDesc: 'A tranquil waterfall surrounded by dense forests, Hirni Falls is located on the Ranchi–Chakradharpur route (NH75E) and suited for a peaceful nature visit. The cascade drops over 35 metres through virgin Sal and teak woodlands, featuring an established viewing pavilion and stairs.',
    safetyStatus: 'suitable',
    safetyLabel: '🟢 Suitable / Normal',
    safetyBadge: 'safe',
    safetyNote: 'Established tourist area with constructed concrete stairs and elevated watchtower. Exercise care on damp stone steps during rainy periods.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Easy',
    accessibilityCategory: 'easy',
    accessibilityDetails: {
      roadCondition: 'Paved National Highway (NH75E) directly accessing the entrance.',
      walkingDistance: 'Approx. 150 metres from the entry gate to the watchtower.',
      trekRequirement: 'Paved walkway and standard stone staircase down to observation decks.',
      terrainDifficulty: 'Easy and family-accessible; paved walking infrastructure throughout.'
    },
    medicalSupport: {
      facility: 'Murhu CHC / Khunti District Hospital',
      distance: 'Approx. 25–35 km along NH75E',
      emergencyNotes: 'Forest department beat office and tourist shelter at entrance.'
    },
    bestSeason: {
      recommended: 'September to February (Autumn & Winter)',
      seasonalNote: 'Lush green forest canopies and excellent panoramic views from the watchtower.',
      monsoonCaution: 'Fine water spray can make lower staircase surfaces slippery during rainfall.'
    },
    routeInfo: {
      location: 'Bandgaon Block, West Singhbhum District, Jharkhand',
      howToReach: 'Directly situated along the Ranchi–Chakradharpur / Chaibasa highway (NH75E).',
      nearbyTown: 'Khunti (~35 km) / Chakradharpur (~40 km) / Ranchi (~65 km)',
      approxDistance: '~65 km south of Ranchi',
      travelTime: 'Approx. 1 hour 40 minutes by car',
      mapQuery: 'Hirni Falls West Singhbhum Jharkhand'
    },
    nearbyExperiences: [
      { type: 'Forest Landscape', name: 'Saranda Forest Periphery', dist: 'Southward', desc: 'Vast sal forest landscape known as the Land of Seven Hundred Hills.' },
      { type: 'Tribal Craft', name: 'Lac & Wood Crafts', dist: 'Khunti / Bandgaon', desc: 'Handcrafted items made with natural forest lac and wood.' },
      { type: 'Local Food', name: 'Chilka Roti & Forest Honey', dist: 'Highway dhabas', desc: 'Traditional crispy rice pancakes and raw forest honey.' },
      { type: 'Heritage', name: 'Birsa Munda Memorial (Ulihatu)', dist: '42 km', desc: 'Historical memorial complex in the Khunti cultural district.' }
    ],
    responsibleTourism: [
      'Respect the tranquility of the dense Sal forest biosphere.',
      'Deposit all litter in designated bins near the tourist complex.',
      'Do not feed wild animals or disturb nesting birds.',
      'Purchase local agricultural products and forest honey directly from village sellers.'
    ],
    ecoScore: {
      score: 86,
      label: 'Prototype Eco-Score',
      verdict: 'Well-Maintained Forest Eco-Reserve',
      criteria: {
        wasteManagement: '88% (Designated disposal zones)',
        basicFacilities: '90% (Tourist pavilion, parking, stairs)',
        environmentalSensitivity: '85% (Forested buffer zone)',
        localParticipation: '82% (Local cooperative counters)',
        safety: '85% (Railing & watchtower infrastructure)'
      }
    },
    accent: '#176B45',
    x: 48,
    y: 68
  },
  {
    id: 'indra-waterfall',
    name: 'Indra Waterfall',
    district: 'Latehar',
    nearbyTown: 'Near Tubed Village, Latehar',
    category: 'Hidden Gem / Forest Escape',
    categoryKey: 'gem',
    image: './images/indra-waterfall.jpg',
    imageDesc: 'Waterfall near Tubed village',
    span: 6,
    shortDesc: 'A relatively small waterfall near Tubed village, surrounded by dense forests and hills, offering a quieter nature experience.',
    fullDesc: 'A relatively small waterfall near Tubed village, Indra Waterfall is surrounded by dense forests and hills, offering a quieter nature experience. Located off the beaten track in Latehar district, it is suited for day visitors seeking an authentic, uncrowded forest setting.',
    safetyStatus: 'suitable',
    safetyLabel: '🟢 Suitable / Normal',
    safetyBadge: 'safe',
    safetyNote: 'Natural stream flow with gentle terrain. Moderate caution advised on unpaved village trail sections during rainy spells.',
    safetyDisclaimer: 'Prototype status only. Not an official government safety certification. Always check real-time local weather alerts before visiting.',
    accessibilityLevel: 'Easy to Moderate',
    accessibilityCategory: 'easy',
    accessibilityDetails: {
      roadCondition: 'Connecting village road from Latehar toward Tubed; rustic in final stretches.',
      walkingDistance: 'Approx. 350–500 metres walk from nearest road stop.',
      trekRequirement: 'Gentle walk along village pathways and small forest trails.',
      terrainDifficulty: 'Slightly uneven dirt path with natural stones; comfortable walking shoes recommended.'
    },
    medicalSupport: {
      facility: 'Latehar Sadar Hospital / Block Health Centers',
      distance: 'Approx. 12–16 km from Tubed area',
      emergencyNotes: 'District medical facilities reachable via Latehar town center.'
    },
    bestSeason: {
      recommended: 'October to February (Post-monsoon & Winter)',
      seasonalNote: 'Streams maintain a clear steady cascade with lush green forest cover after the monsoon.',
      monsoonCaution: 'Avoid walking close to water edges during intense downpours.'
    },
    routeInfo: {
      location: 'Near Tubed Village, Latehar District, Jharkhand',
      howToReach: 'Accessible by road from Latehar town toward Tubed village via local transport or private vehicle.',
      nearbyTown: 'Latehar Town (~14 km)',
      approxDistance: '~14 km from Latehar district headquarters',
      travelTime: 'Approx. 25–35 minutes drive',
      mapQuery: '23.799014110082204,84.57010692506162 (Indra Waterfall Latehar Jharkhand)'
    },
    nearbyExperiences: [
      { type: 'Forest Trail', name: 'Tubed Forest Hills', dist: 'Surrounding', desc: 'Scenic forested hill slopes and natural walking tracks.' },
      { type: 'Local Market', name: 'Latehar Town Bazaar', dist: '14 km', desc: 'District market featuring regional agricultural produce and tribal crafts.' },
      { type: 'Local Food', name: 'Chilka Roti & Dal Pitha', dist: 'Latehar dhabas', desc: 'Steamed spiced rice-flour dumplings and rice flatbreads.' },
      { type: 'Stay', name: 'Latehar Town Guesthouses', dist: '14 km', desc: 'Town accommodation options with local transport connectivity.' }
    ],
    responsibleTourism: [
      'Pack out all wrappers, containers, and non-biodegradable items.',
      'Respect village farmlands and local community paths.',
      'Do not light fires or leave combustible material in dry forest areas.',
      'Support local village transportation and small kiosks.'
    ],
    ecoScore: {
      score: 87,
      label: 'Prototype Eco-Score',
      verdict: 'Quiet Forest Ecosystem',
      criteria: {
        wasteManagement: '84% (Low visitor footprint / clean area)',
        basicFacilities: '76% (Rustic approach path)',
        environmentalSensitivity: '96% (Intact woodland buffer)',
        localParticipation: '86% (Village community presence)',
        safety: '88% (Manageable water levels)'
      }
    },
    accent: '#35B9A5',
    x: 32,
    y: 38
  }
];

export function getWaterfall(id) {
  if (!id) return null;
  const clean = (str) => str.replace('-falls', '').replace('-waterfall', '').replace('-waterfalls', '').replace('sugga', 'suga');
  return WATERFALLS.find(w => w.id === id || clean(w.id) === clean(id));
}
