import { createElement } from "../../utils/dom.js";

const DEFAULT_AUDIO_PATH = "/assets/audio/a-bencao.mp3";
const DEFAULT_AUDIO_TITLE = "A Benção (Piano)";

export const createMusicPlayer = (config = {}) => {
  const audioSrc = config?.assets?.audio || DEFAULT_AUDIO_PATH;
  const audioTitle = config?.assets?.audioTitle || DEFAULT_AUDIO_TITLE;

  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.6;

  // Extra safety on ended event to guarantee continuous loop
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  let isPlaying = false;
  let previousVolume = 0.6;
  let isExpanded = false;

  // Floating wrapper:
  // On mobile: strictly at the top of the screen (top-3 left-3)
  // On desktop: on the left side (md:top-auto md:bottom-6 md:left-6)
  const container = createElement("aside", {
    className:
      "fixed top-3 left-3 md:top-auto md:bottom-6 md:left-6 z-40 select-none font-button transition-all duration-300",
    attributes: {
      id: "music-player-widget",
      "aria-label": "Controle de música",
    },
  });

  // SVG Icons
  const playIconSvg = `
    <svg class="h-3.5 w-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  `;

  const pauseIconSvg = `
    <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  `;

  const getVolumeIcon = (vol) => {
    if (vol === 0 || audio.muted) {
      return `
        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      `;
    }
    return `
      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    `;
  };

  // --- RETRACTED / COMPACT PILL (Initial state) ---
  const compactPill = createElement("button", {
    className:
      "flex h-8 items-center gap-1.5 rounded-full border border-serenity/40 bg-white/95 px-2.5 py-1 text-slate-700 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-lg cursor-pointer active:scale-95",
    attributes: {
      type: "button",
      "aria-label": "Abrir controles da música",
      title: "Música de fundo • Clique para expandir",
    },
  });

  const miniEqualizer = createElement("div", {
    className: "flex h-3.5 w-3 items-end justify-center gap-0.5",
    children: [
      createElement("span", {
        className: "w-0.5 rounded-full bg-serenity transition-all duration-300 h-1.5",
      }),
      createElement("span", {
        className: "w-0.5 rounded-full bg-serenity transition-all duration-300 h-2.5",
      }),
      createElement("span", {
        className: "w-0.5 rounded-full bg-serenity transition-all duration-300 h-1",
      }),
    ],
  });

  const miniBars = miniEqualizer.children;

  const miniPlayIcon = createElement("span", {
    className: "flex items-center text-serenity",
  });
  miniPlayIcon.innerHTML = playIconSvg;

  const miniLabel = createElement("span", {
    className: "text-[11px] font-medium tracking-tight text-slate-700 max-w-[80px] sm:max-w-[100px] truncate",
    text: "Música",
  });

  compactPill.append(miniEqualizer, miniPlayIcon, miniLabel);

  // --- EXPANDED PANEL ---
  const expandedCard = createElement("div", {
    className:
      "hidden flex-row items-center gap-2 rounded-full border border-serenity/30 bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md transition-all duration-300",
  });

  // Play/Pause button in expanded card
  const playBtn = createElement("button", {
    className:
      "flex h-7 w-7 items-center justify-center rounded-full bg-serenity text-white shadow-sm transition hover:bg-leaf focus:outline-none cursor-pointer active:scale-95",
    attributes: {
      type: "button",
      "aria-label": "Tocar / Pausar música",
    },
  });
  playBtn.innerHTML = playIconSvg;

  // Track info
  const trackDetails = createElement("div", {
    className: "flex flex-col max-w-[90px] sm:max-w-[120px] overflow-hidden",
    children: [
      createElement("span", {
        className: "truncate text-[11px] font-semibold text-slate-800",
        text: audioTitle,
      }),
      createElement("span", {
        className: "text-[9px] uppercase tracking-wider text-leaf font-medium",
        text: "Em repetição",
      }),
    ],
  });

  // Volume icon button
  const volBtn = createElement("button", {
    className:
      "flex h-6 w-6 items-center justify-center rounded-full text-slate-600 transition hover:text-serenity focus:outline-none cursor-pointer",
    attributes: {
      type: "button",
      "aria-label": "Mudo / Volume",
    },
  });
  volBtn.innerHTML = getVolumeIcon(audio.volume);

  // Volume slider
  const volSlider = createElement("input", {
    className: "volume-slider h-1 w-14 sm:w-16 cursor-pointer rounded-lg bg-light-gray accent-serenity",
    attributes: {
      type: "range",
      min: "0",
      max: "1",
      step: "0.01",
      value: String(audio.volume),
      "aria-label": "Ajuste de volume",
    },
  });

  // Close/Collapse button
  const closeBtn = createElement("button", {
    className:
      "flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer text-xs ml-0.5",
    attributes: {
      type: "button",
      "aria-label": "Recolher player",
      title: "Recolher player",
    },
    text: "✕",
  });

  expandedCard.append(playBtn, trackDetails, volBtn, volSlider, closeBtn);

  // --- STATE HELPERS ---
  const updateEqualizerUI = (active) => {
    if (active) {
      miniBars[0].classList.add("animate-bar-1");
      miniBars[1].classList.add("animate-bar-2");
      miniBars[2].classList.add("animate-bar-3");
    } else {
      miniBars[0].classList.remove("animate-bar-1");
      miniBars[1].classList.remove("animate-bar-2");
      miniBars[2].classList.remove("animate-bar-3");
      miniBars[0].style.height = "4px";
      miniBars[1].style.height = "6px";
      miniBars[2].style.height = "3px";
    }
  };

  const syncButtons = () => {
    if (isPlaying) {
      miniPlayIcon.innerHTML = pauseIconSvg;
      playBtn.innerHTML = pauseIconSvg;
      updateEqualizerUI(true);
    } else {
      miniPlayIcon.innerHTML = playIconSvg;
      playBtn.innerHTML = playIconSvg;
      updateEqualizerUI(false);
    }
  };

  const expandPlayer = () => {
    isExpanded = true;
    compactPill.classList.add("hidden");
    expandedCard.classList.remove("hidden");
    expandedCard.classList.add("flex");
  };

  const collapsePlayer = () => {
    isExpanded = false;
    expandedCard.classList.add("hidden");
    expandedCard.classList.remove("flex");
    compactPill.classList.remove("hidden");
  };

  compactPill.addEventListener("click", expandPlayer);
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    collapsePlayer();
  });

  // Collapse if user clicks outside
  document.addEventListener("click", (e) => {
    if (isExpanded && !container.contains(e.target)) {
      collapsePlayer();
    }
  });

  // Volume interaction
  const syncVolumeUI = () => {
    const effectiveVol = audio.muted ? 0 : audio.volume;
    volSlider.value = String(effectiveVol);
    volBtn.innerHTML = getVolumeIcon(effectiveVol);
  };

  volSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = val === 0;
    if (val > 0) previousVolume = val;
    syncVolumeUI();
  });

  volBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolume > 0 ? previousVolume : 0.6;
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
    }
    syncVolumeUI();
  });

  // Audio Play / Pause
  const play = async () => {
    try {
      await audio.play();
      isPlaying = true;
      syncButtons();
      return true;
    } catch {
      isPlaying = false;
      syncButtons();
      return false;
    }
  };

  const pause = () => {
    audio.pause();
    isPlaying = false;
    syncButtons();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });

  container.append(compactPill, expandedCard);

  return {
    element: container,
    play,
    pause,
    togglePlay,
    expand: expandPlayer,
    collapse: collapsePlayer,
    getAudio: () => audio,
    getIsPlaying: () => isPlaying,
    setVolume: (val) => {
      audio.volume = Math.max(0, Math.min(1, val));
      syncVolumeUI();
    },
  };
};
