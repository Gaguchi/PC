// RAWG.io API configuration
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY || '';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// Map game keys to RAWG slugs for API lookup
const rawgSlugs = {
  cyberpunk2077: 'cyberpunk-2077',
  starfield: 'starfield',
  helldivers2: 'helldivers-2',
  cs2: 'counter-strike-2',
  fortnite: 'fortnite',
  forza: 'forza-horizon-5'
};

const gameDatabase = {
  cyberpunk2077: {
    title: 'Cyberpunk 2077',
    summary: 'Path Tracing Ultra • DLSS 3 Frame Gen • 4K',
    fps: { value: '94 FPS', preset: '4K PT Ultra + DLSS Performance' },
    buildTitle: 'Creator Studio X (RTX 5090)',
    metrics: {
      cpuLoad: '71%',
      cpuNotes: 'Threadripper PRO 7995WX stays under 65 °C (custom loop).',
      gpuLoad: '97%',
      gpuNotes: 'RTX 5090 at 420 W, 59 °C coolant temp.',
      latency: '14.3 ms',
      latencyNotes: 'DLSS 3 Frame Generation engaged, Reflex on.',
      power: '873 W',
      powerNotes: '240 V circuit recommended for sustained throughput.'
    },
    specs: [
      { label: 'CPU', value: 'AMD Threadripper PRO 7995WX' },
      { label: 'GPU', value: 'NVIDIA RTX 5090 Founders Edition' },
      { label: 'Motherboard', value: 'ASUS Pro WS TRX50-SAGE WIFI' },
      { label: 'Memory', value: '128 GB DDR5 ECC 6400 MHz (4×32)' },
      { label: 'Storage', value: '2 TB Samsung 990 PRO (Gen5) + 4 TB Sabrent Rocket 4' },
      { label: 'Cooling', value: 'Custom loop · dual 360 mm radiators · quick disconnects' },
      { label: 'PSU', value: '1000 W Corsair HX1000i Platinum' },
      { label: 'Chassis', value: 'Lian Li O11 Vision' }
    ],
    comparisons: [
      { title: 'Alan Wake 2', preset: 'Path Tracing High', resolution: '3440×1440', fps: '128' },
      { title: 'Dying Light 2', preset: 'RT Ultra', resolution: '3840×2160', fps: '102' },
      { title: 'Cyberpunk 2077 (RT Medium)', preset: 'RT Medium', resolution: '2560×1440', fps: '162' },
      { title: 'The Last of Us Part I', preset: 'Ultra', resolution: '3840×2160', fps: '88' }
    ]
  },
  starfield: {
    title: 'Starfield',
    summary: 'Ultra preset with FSR 3 Quality • 4K',
    fps: { value: '83 FPS', preset: '4K Ultra + FSR 3 Quality' },
    buildTitle: 'Constellation Prime (RTX 5090)',
    metrics: {
      cpuLoad: '64%',
      cpuNotes: 'Ryzen 9 9950X tuned with Curve Optimizer (-20).' ,
      gpuLoad: '92%',
      gpuNotes: 'VRAM at 17.4 GB usage during New Atlantis scenes.',
      latency: '18.7 ms',
      latencyNotes: 'FSR Frame Generation keeps frametimes stable.',
      power: '712 W',
      powerNotes: 'Transient spikes up to 860 W captured in telemetry.'
    },
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 9 9950X' },
      { label: 'GPU', value: 'NVIDIA RTX 5090 Founders Edition' },
      { label: 'Motherboard', value: 'MSI MEG X870E ACE' },
      { label: 'Memory', value: '64 GB DDR5 6600 MHz (2×32)' },
      { label: 'Storage', value: '4 TB WD Black SN850X NVMe' },
      { label: 'Cooling', value: 'Corsair iCUE H170i Elite 420 mm AIO' },
      { label: 'PSU', value: '1200 W Seasonic Vertex PX' },
      { label: 'Chassis', value: 'Fractal North XL' }
    ],
    comparisons: [
      { title: 'Elden Ring', preset: 'Maximum', resolution: '3840×2160', fps: '116' },
      { title: 'Horizon Forbidden West', preset: 'Very High', resolution: '3840×2160', fps: '94' },
      { title: 'Starfield (Ultra 1440p)', preset: 'Ultra', resolution: '2560×1440', fps: '128' },
      { title: 'Flight Simulator 2024', preset: 'Ultra', resolution: '3440×1440', fps: '78' }
    ]
  },
  helldivers2: {
    title: 'Helldivers II',
    summary: 'Max preset with DLSS Quality • 4K',
    fps: { value: '142 FPS', preset: '4K Max + DLSS Quality' },
    buildTitle: 'Dropship Command (RTX 5080)',
    metrics: {
      cpuLoad: '58%',
      cpuNotes: 'Intel Core i9-14900KS at 6.1 GHz TVB peak.',
      gpuLoad: '88%',
      gpuNotes: 'RTX 5080 undervolted to 0.975 V for 340 W draw.',
      latency: '9.6 ms',
      latencyNotes: 'NV Reflex + G-SYNC Ultimate monitor.',
      power: '648 W',
      powerNotes: 'Peaks at 690 W with orbital barrage effects.'
    },
    specs: [
      { label: 'CPU', value: 'Intel Core i9-14900KS' },
      { label: 'GPU', value: 'NVIDIA RTX 5080' },
      { label: 'Motherboard', value: 'ASUS ROG Maximus Z890 Hero' },
      { label: 'Memory', value: '32 GB DDR5 7200 MHz (2×16)' },
      { label: 'Storage', value: '2 TB Samsung 990 PRO NVMe' },
      { label: 'Cooling', value: 'EK-AIO 360 D-RGB' },
      { label: 'PSU', value: '1000 W EVGA SuperNOVA P6' },
      { label: 'Chassis', value: 'NZXT H7 Flow' }
    ],
    comparisons: [
      { title: 'Apex Legends', preset: 'Competitive', resolution: '2560×1440', fps: '280' },
      { title: 'Call of Duty: MWIII', preset: 'Ultra', resolution: '3840×2160', fps: '132' },
      { title: 'Helldivers II (Competitive)', preset: 'Competitive', resolution: '2560×1440', fps: '216' },
      { title: 'Remnant II', preset: 'Ultra', resolution: '3440×1440', fps: '120' }
    ]
  },
  cs2: {
    title: 'Counter-Strike 2',
    summary: 'Tournament locked 360 Hz • 1080p',
    fps: { value: '518 FPS', preset: '1080p eSports preset' },
    buildTitle: 'Arena Pro 360 (RTX 4080 SUPER)',
    metrics: {
      cpuLoad: '46%',
      cpuNotes: 'Intel Core i7-14700KF overclocked to 5.7 GHz P-core.',
      gpuLoad: '54%',
      gpuNotes: 'RTX 4080 SUPER drawing 205 W at 2610 MHz.',
      latency: '3.1 ms',
      latencyNotes: 'Reflex + 360 Hz G-SYNC esports monitor.',
      power: '482 W',
      powerNotes: 'Headroom available for additional peripherals.'
    },
    specs: [
      { label: 'CPU', value: 'Intel Core i7-14700KF' },
      { label: 'GPU', value: 'NVIDIA RTX 4080 SUPER' },
      { label: 'Motherboard', value: 'ASUS ROG Strix Z790-A Gaming WiFi II' },
      { label: 'Memory', value: '32 GB DDR5 6400 MHz (2×16)' },
      { label: 'Storage', value: '1 TB Samsung 990 EVO NVMe' },
      { label: 'Cooling', value: 'Noctua NH-D15 Chromax Black' },
      { label: 'PSU', value: '850 W Corsair RM850x Shift' },
      { label: 'Chassis', value: 'Corsair 5000D Airflow' }
    ],
    comparisons: [
      { title: 'Valorant', preset: 'Tournament', resolution: '1920×1080', fps: '612' },
      { title: 'Overwatch 2', preset: 'Ultra Competitive', resolution: '2560×1440', fps: '348' },
      { title: 'CS2 (Low 1440p)', preset: 'Low', resolution: '2560×1440', fps: '402' },
      { title: 'Rainbow Six Siege', preset: 'Ultra', resolution: '1920×1080', fps: '516' }
    ]
  },
  fortnite: {
    title: 'Fortnite',
    summary: 'Unreal Engine 5 Nanite + Lumen • Performance mode fallback ready',
    fps: { value: '164 FPS', preset: '4K Nanite + Lumen High' },
    buildTitle: 'Creator Hybrid (RTX 5080)',
    metrics: {
      cpuLoad: '57%',
      cpuNotes: 'Ryzen 7 9800X3D keeps frametimes smooth with 3D V-Cache.',
      gpuLoad: '86%',
      gpuNotes: 'RTX 5080 draws 330 W in dense foliage biomes.',
      latency: '7.8 ms',
      latencyNotes: 'Performance Mode fallback hits 260 FPS (1440p).',
      power: '618 W',
      powerNotes: 'UPS buffer recommended for competitive play.'
    },
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 7 9800X3D' },
      { label: 'GPU', value: 'NVIDIA RTX 5080' },
      { label: 'Motherboard', value: 'Gigabyte X870 AORUS Master' },
      { label: 'Memory', value: '32 GB DDR5 6400 MHz (2×16)' },
      { label: 'Storage', value: '2 TB Crucial T705 NVMe' },
      { label: 'Cooling', value: 'NZXT Kraken 360 RGB' },
      { label: 'PSU', value: '850 W be quiet! Dark Power 13' },
      { label: 'Chassis', value: 'Lian Li Lancool III RGB' }
    ],
    comparisons: [
      { title: 'Fortnite (Performance Mode)', preset: 'Performance', resolution: '2560×1440', fps: '262' },
      { title: 'PUBG Battlegrounds', preset: 'Ultra', resolution: '2560×1440', fps: '188' },
      { title: "Assassin's Creed Mirage", preset: 'Ultra High', resolution: '3840×2160', fps: '112' },
      { title: 'Fortnite (Competitive 1080p)', preset: 'Low', resolution: '1920×1080', fps: '308' }
    ]
  },
  forza: {
    title: 'Forza Horizon 5',
    summary: 'Extreme preset with RT High • 4K',
    fps: { value: '138 FPS', preset: '4K Extreme + RT High' },
    buildTitle: 'TrackStar Ultimate (RTX 5090)',
    metrics: {
      cpuLoad: '49%',
      cpuNotes: 'Ryzen 9 9950X with Precision Boost Overdrive tuned.',
      gpuLoad: '94%',
      gpuNotes: 'RTX 5090 VRAM usage at 12.6 GB during wet weather.',
      latency: '8.4 ms',
      latencyNotes: 'HDR + G-SYNC 120 Hz display pipeline.',
      power: '701 W',
      powerNotes: 'Peaks to 780 W during dense traffic replays.'
    },
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 9 9950X' },
      { label: 'GPU', value: 'NVIDIA RTX 5090' },
      { label: 'Motherboard', value: 'ASUS ROG Crosshair X870E Hero' },
      { label: 'Memory', value: '64 GB DDR5 6600 MHz (2×32)' },
      { label: 'Storage', value: '2 TB Samsung 990 PRO NVMe' },
      { label: 'Cooling', value: 'EK Nucleus CR360 Lux D-RGB' },
      { label: 'PSU', value: '1000 W EVGA SuperNOVA G7' },
      { label: 'Chassis', value: 'Phanteks NV7' }
    ],
    comparisons: [
      { title: 'Forza Horizon 5 (1440p)', preset: 'Extreme', resolution: '2560×1440', fps: '192' },
      { title: 'F1 24', preset: 'Max', resolution: '3840×2160', fps: '158' },
      { title: 'Need for Speed Unbound', preset: 'Ultra', resolution: '3840×2160', fps: '124' },
      { title: 'DiRT Rally 2.0', preset: 'Ultra', resolution: '3440×1440', fps: '184' }
    ]
  }
};

const componentCatalog = {
  GPU: [
    {
      value: 'NVIDIA RTX 5090 Founders Edition',
      label: 'NVIDIA RTX 5090 FE',
      impact: '≈ +7% FPS uplift versus RTX 5080 baseline.'
    },
    {
      value: 'NVIDIA RTX 5090 (AIB OC)',
      label: 'NVIDIA RTX 5090 AIB OC',
      impact: 'Boost bins up to 2.8 GHz · +3% avg FPS · +40 W load.'
    },
    {
      value: 'NVIDIA RTX 5090',
      label: 'NVIDIA RTX 5090 (Reference)',
      impact: 'Reference triple-slot design · baseline acoustics.'
    },
    {
      value: 'NVIDIA RTX 5080',
      label: 'NVIDIA RTX 5080',
      impact: 'Efficient 4K choice · −8% FPS vs 5090 FE · −120 W.'
    },
    {
      value: 'NVIDIA RTX 4080 SUPER',
      label: 'NVIDIA RTX 4080 SUPER',
      impact: 'E-sports tuned · −18% FPS vs 5090 · −230 W draw.'
    },
    {
      value: 'AMD Radeon RX 8900 XTX',
      label: 'AMD Radeon RX 8900 XTX',
      impact: 'RDNA 4 flagship · excels at 1440p · weaker RT.'
    }
  ],
  Chassis: [
    {
      value: 'Lian Li O11 Vision',
      label: 'Lian Li O11 Vision',
      impact: 'Panoramic glass · best with vertical GPU riser.'
    },
    {
      value: 'Fractal North XL',
      label: 'Fractal North XL',
      impact: 'Scandi airflow · includes wood slat front.'
    },
    {
      value: 'NZXT H7 Flow',
      label: 'NZXT H7 Flow',
      impact: 'High airflow · tinted tempered glass side.'
    },
    {
      value: 'Corsair 5000D Airflow',
      label: 'Corsair 5000D Airflow',
      impact: 'Dual 360 mm radiator support · clean PSU shroud.'
    },
    {
      value: 'Lian Li Lancool III RGB',
      label: 'Lian Li Lancool III RGB',
      impact: 'Triple RGB intake · hinged tempered glass panels.'
    },
    {
      value: 'Phanteks NV7',
      label: 'Phanteks NV7',
      impact: 'Showcase chassis · wraparound lighting diffuser.'
    }
  ]
};

function renderSpecList(specs, container) {
  const frag = document.createDocumentFragment();
  specs.forEach(({ label, value, note }) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    if (note) {
      const noteEl = document.createElement('small');
      noteEl.textContent = note;
      dd.appendChild(noteEl);
    }
    frag.append(dt, dd);
  });
  container.innerHTML = '';
  container.appendChild(frag);
}

function renderComparisonTable(comparisons, tableBody) {
  tableBody.innerHTML = comparisons
    .map(
      ({ title, preset, resolution, fps }) => `
        <tr>
          <td>${title}</td>
          <td>${preset}</td>
          <td>${resolution}</td>
          <td>${fps}</td>
        </tr>
      `
    )
    .join('');
}

export function initUI() {
  const overlay = document.getElementById('gameOverlay');
  const gameGrid = document.getElementById('gameGrid');
  const changeGameButton = document.getElementById('changeGame');

  const selectedGameTitle = document.getElementById('selectedGameTitle');
  const buildSummary = document.getElementById('buildSummary');
  const primaryFps = document.getElementById('primaryFps');
  const primaryPreset = document.getElementById('primaryPreset');
  const buildTitle = document.getElementById('buildTitle');
  const specList = document.getElementById('specList');
  const comparisonTable = document.getElementById('comparisonTable');
  const cpuLoad = document.getElementById('cpuLoad');
  const cpuLoadNotes = document.getElementById('cpuLoadNotes');
  const gpuLoad = document.getElementById('gpuLoad');
  const gpuLoadNotes = document.getElementById('gpuLoadNotes');
  const latency = document.getElementById('latency');
  const latencyNotes = document.getElementById('latencyNotes');
  const powerDraw = document.getElementById('powerDraw');
  const powerNotes = document.getElementById('powerNotes');
  const specEditor = document.getElementById('specEditor');

  const specState = {
    currentGame: null,
    baseSpecs: [],
    activeSpecs: [],
    baselineFps: { value: '—', preset: '—' }
  };

  const selectRefs = new Map();
  let specEditorNote = null;
  const defaultEditorMessage =
    'Adjust key components to preview how the stack shifts. Impact callouts are relative estimates.';

  const setEditorNote = (message = defaultEditorMessage) => {
    if (specEditorNote) {
      specEditorNote.textContent = message;
    }
  };

  const applyComponentSelection = (label, optionMeta) => {
    if (!specState.activeSpecs.length) {
      setEditorNote();
      return;
    }

    const target = specState.activeSpecs.find((spec) => spec.label === label);
    const base = specState.baseSpecs.find((spec) => spec.label === label);

    if (!target || !base) {
      setEditorNote();
      return;
    }

    const nextValue = optionMeta?.value ?? base.value;
    target.value = nextValue;

    if (optionMeta && optionMeta.value !== base.value) {
      target.note = optionMeta.impact || 'Custom selection applied.';
      setEditorNote(optionMeta.impact || 'Custom selection applied.');
    } else {
      delete target.note;
      const hasOtherCustom = specState.activeSpecs.some((spec) => spec.note);
      setEditorNote(hasOtherCustom ? 'Custom components active.' : defaultEditorMessage);
    }

    if (label === 'GPU') {
      if (optionMeta && optionMeta.value !== base.value) {
        const metaLabel = optionMeta.label || optionMeta.value;
        primaryFps.textContent = `${specState.baselineFps.value}*`;
        primaryPreset.textContent = `${specState.baselineFps.preset} · ${metaLabel}`;
      } else {
        primaryFps.textContent = specState.baselineFps.value;
        primaryPreset.textContent = specState.baselineFps.preset;
      }
    }

    renderSpecList(specState.activeSpecs, specList);
  };

  const buildSpecEditor = () => {
    specEditor.innerHTML = '';
    selectRefs.clear();

    Object.entries(componentCatalog).forEach(([label, optionList]) => {
      const field = document.createElement('div');
      field.className = 'spec-editor__field';

      const fieldId = `spec-editor-${label.toLowerCase()}`;
      const labelEl = document.createElement('label');
      labelEl.setAttribute('for', fieldId);
      labelEl.textContent = label;

      const select = document.createElement('select');
      select.id = fieldId;

      optionList.forEach((option) => {
        const optionEl = document.createElement('option');
        optionEl.value = option.value;
        optionEl.textContent = option.label;
        select.appendChild(optionEl);
      });

      select.addEventListener('change', (event) => {
        const { value } = event.target;
        const meta = optionList.find((opt) => opt.value === value) || { value };
        applyComponentSelection(label, meta);
      });

      field.append(labelEl, select);
      specEditor.appendChild(field);
      selectRefs.set(label, { select, optionList });
    });

    specEditorNote = document.createElement('p');
    specEditorNote.className = 'spec-editor__note';
    specEditor.appendChild(specEditorNote);
    setEditorNote();
  };

  buildSpecEditor();

  // Fetch game box art from RAWG.io API
  const fetchGameBoxArt = async (gameKey) => {
    const slug = rawgSlugs[gameKey];
    if (!slug) {
      console.warn('[RAWG] Invalid game key:', gameKey);
      return null;
    }

    if (!RAWG_API_KEY) {
      console.warn('[RAWG] API key not set. Add VITE_RAWG_API_KEY to environment variables.');
      return null;
    }

    try {
      const url = `${RAWG_BASE_URL}/games/${slug}?key=${RAWG_API_KEY}`;
      console.log('[RAWG] Fetching:', url);
      
      const response = await fetch(url);
      console.log('[RAWG] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[RAWG] API error response:', errorText);
        throw new Error(`RAWG API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[RAWG] Game data for', gameKey, ':', data);
      console.log('[RAWG] Background image URL:', data.background_image);
      
      return data.background_image || null;
    } catch (error) {
      console.error('[RAWG] Failed to fetch box art for', gameKey, ':', error);
      return null;
    }
  };

  const applyGame = async (key) => {
    const data = gameDatabase[key];
    if (!data) {
      console.warn('No data found for game:', key);
      return;
    }

    selectedGameTitle.textContent = data.title;
    buildSummary.textContent = data.summary;
    primaryFps.textContent = data.fps.value;
    primaryPreset.textContent = data.fps.preset;
    buildTitle.textContent = data.buildTitle;

    cpuLoad.textContent = data.metrics.cpuLoad;
    cpuLoadNotes.textContent = data.metrics.cpuNotes;
    gpuLoad.textContent = data.metrics.gpuLoad;
    gpuLoadNotes.textContent = data.metrics.gpuNotes;
    latency.textContent = data.metrics.latency;
    latencyNotes.textContent = data.metrics.latencyNotes;
    powerDraw.textContent = data.metrics.power;
    powerNotes.textContent = data.metrics.powerNotes;

    specState.currentGame = key;
    specState.baseSpecs = data.specs.map((spec) => ({ ...spec }));
    specState.activeSpecs = data.specs.map((spec) => ({ ...spec }));
    specState.baselineFps = { ...data.fps };

    renderSpecList(specState.activeSpecs, specList);
    renderComparisonTable(data.comparisons, comparisonTable);

    selectRefs.forEach(({ select, optionList }, label) => {
      const baseSpec = specState.baseSpecs.find((spec) => spec.label === label);
      if (!baseSpec) {
        return;
      }

      if (!optionList.some((opt) => opt.value === baseSpec.value)) {
        const optionEl = document.createElement('option');
        optionEl.value = baseSpec.value;
        optionEl.textContent = baseSpec.value;
        select.appendChild(optionEl);
        optionList.push({ value: baseSpec.value, label: baseSpec.value });
      }

      select.value = baseSpec.value;
    });

    primaryFps.textContent = specState.baselineFps.value;
    primaryPreset.textContent = specState.baselineFps.preset;
    setEditorNote();

    overlay.classList.add('is-hidden');
    overlay.setAttribute('aria-hidden', 'true');
  };

  gameGrid.querySelectorAll('.game-option').forEach((btn) => {
    btn.addEventListener('click', () => applyGame(btn.dataset.game));
  });

  changeGameButton.addEventListener('click', () => {
    overlay.classList.remove('is-hidden');
    overlay.setAttribute('aria-hidden', 'false');
    setEditorNote();
  });

  // Load box art for all game options on init
  const loadGameBoxArt = async () => {
    console.log('[RAWG] Starting box art load...');
    console.log('[RAWG] API Key present:', !!RAWG_API_KEY);
    console.log('[RAWG] API Key value:', RAWG_API_KEY ? `${RAWG_API_KEY.slice(0, 8)}...` : 'NOT SET');
    
    const artContainers = gameGrid.querySelectorAll('[data-game-art]');
    console.log('[RAWG] Found', artContainers.length, 'game art containers');
    
    for (const container of artContainers) {
      const gameKey = container.dataset.gameArt;
      console.log('[RAWG] Loading box art for:', gameKey);
      
      const imageUrl = await fetchGameBoxArt(gameKey);
      
      if (imageUrl) {
        console.log('[RAWG] Setting background image for', gameKey, ':', imageUrl);
        container.style.backgroundImage = `url(${imageUrl})`;
      } else {
        console.warn('[RAWG] No image URL returned for', gameKey);
      }
    }
    
    console.log('[RAWG] Box art loading complete');
  };

  // Initialize box art loading
  if (RAWG_API_KEY) {
    loadGameBoxArt();
  } else {
    console.warn('VITE_RAWG_API_KEY not set. Game box art will not load.');
  }

  return { applyGame };
}
