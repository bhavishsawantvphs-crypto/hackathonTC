function getWaterfallUserKey() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const d = JSON.parse(localStorage.getItem(k));
        if (d && d.user && d.user.id) return "jharkhandTripPlan_" + d.user.id;
      }
    }
  } catch (e) {}
  return null;
}

export function getSchedulerItems() {
  const userKey = getWaterfallUserKey();
  if (!userKey) return [];
  try {
    let raw = localStorage.getItem(userKey);
    if (!raw) raw = localStorage.getItem('jharkhandTripPlan');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not read scheduler from localStorage', e);
    return [];
  }
}

export function isWaterfallInScheduler(id) {
  if (!id) return false;
  const cleanId = id.startsWith('waterfall-') ? id : 'waterfall-' + id;
  const rawId = id.replace(/^waterfall-/, '');
  const items = getSchedulerItems();
  return items.some(it => it.id === cleanId || it.id === rawId || it.id === id);
}

export function addWaterfallToScheduler(waterfall) {
  if (!waterfall || !waterfall.id) return { added: false };

  const userKey = getWaterfallUserKey();
  if (!userKey) {
    if (confirm("Please log in or sign up to add waterfalls to your Trip Plan. Go to Sign In?")) {
      window.location.href = "../../auth.html?redirect=hidden-waterfalls-jharkhand/dist/index.html";
    }
    return { added: false, guest: true };
  }
  
  const cleanId = 'waterfall-' + waterfall.id;
  const rawId = waterfall.id.replace(/^waterfall-/, '');
  const items = getSchedulerItems();
  const existing = items.find(it => it.id === cleanId || it.id === rawId || it.id === waterfall.id);
  
  if (!existing) {
    const safeItem = {
      id: cleanId,
      siteId: rawId,
      name: waterfall.name,
      module: 'waterfalls',
      category: waterfall.category || 'Hidden Waterfall',
      location: (waterfall.district ? waterfall.district + ', Jharkhand' : 'Jharkhand'),
      district: waterfall.district,
      description: waterfall.shortDesc || waterfall.summary || '',
      image: waterfall.image || null,
      accessibility: waterfall.accessibilityLevel || '',
      safetyStatus: waterfall.safetyLabel || waterfall.safetyStatus || '',
      bestSeason: (waterfall.bestSeason && waterfall.bestSeason.recommended) ? waterfall.bestSeason.recommended : '',
      sourceSection: 'waterfalls',
      link: 'hidden-waterfalls-jharkhand/dist/index.html#/waterfall/' + waterfall.id,
      addedAt: Date.now()
    };
    
    items.push(safeItem);
    try {
      localStorage.setItem(userKey, JSON.stringify(items));
      localStorage.setItem('jharkhandTripPlan', JSON.stringify(items));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('schedulerUpdated', { detail: safeItem }));
    } catch (e) {
      console.warn('Could not save scheduler item', e);
    }
    return { added: true, item: safeItem };
  }
  
  return { added: false, item: existing };
}