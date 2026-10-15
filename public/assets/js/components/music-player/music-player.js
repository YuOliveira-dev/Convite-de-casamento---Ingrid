import { createElement } from "../../utils/dom.js";

const DEFAULT_AUDIO_PATH = "/assets/audio/a-bencao.mp3";
const DEFAULT_AUDIO_TITLE = "A Benção (Instrumental Piano)";

export const createMusicPlayer = (config = {}) => {
  const audioSrc = config?.assets?.audio || DEFAULT_AUDIO_PATH;
  const audioTitle = config?.assets?.audioTitle || DEFAULT_AUDIO_TITLE;

  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.6;

  // Restart on ended as extra safety for infinite repeat
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  let isPlaying = false;
  let previousVolume = 0.6;
  let isExpanded = false;

  // UI Container (Floating widget)
  const container = createElement("aside", {
    className:
      "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center select-none font-button transition-all duration-300",
    attributes: {
      "aria-label": "Controle de música de fundo",
    },
  });

  const card = createElement("div", {
    className:
      "flex items-center gap-2 rounded-full border border-serenity/30 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl sm:px-4",
  });

  // Equalizer visualizer bars
  const equalizer = createElement("div", {
    className: "flex h-5 w-4 items-end justify-center gap-0.5",
    attributes: { "aria-hidden": "true" },
    children: [
      createElement("span", {
        className: "w-1 rounded-full bg-serenity transition-all duration-300 h-2",
      }),
      createElement("span", {
        className: "w-1 rounded-full bg-serenity transition-all duration-300 h-3",
      }),
      createElement("span", {
        className: "w-1 rounded-full bg-serenity transition-all duration-300 h-1.5",
      }),
    ],
  });

  const bars = equalizer.children;

  const setEqualizerActive = (active) => {
    if (active) {
      bars[0].classList.add("animate-bar-1");
      bars[1].classList.add("animate-bar-2");
      bars[2].classList.add("animate-bar-3");
    } else {
      bars[0].classList.remove("animate-bar-1");
      bars[1].classList.remove("animate-bar-2");
      bars[2].classList.remove("animate-bar-3");
      bars[0].style.height = "6px";
      bars[1].style.height = "10px";
      bars[2].style.height = "4px";
    }
  };

  // Play/Pause button
  const playButton = createElement("button", {
    className:
      "flex h-9 w-9 items-center justify-center rounded-full bg-serenity text-white shadow-sm transition duration-200 hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-serenity focus:ring-offset-1 cursor-pointer active:scale-95",
    attributes: {
      type: "button",
      "aria-label": "Tocar música",
      title: "Play / Pause",
    },
  });

  const playIconSvg = `
    <svg class="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  `;

  const pauseIconSvg = `
    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  `;

  playButton.innerHTML = playIconSvg;

  // Track info / label
  const trackInfo = createElement("div", {
    className: "hidden flex-col max-w-[130px] sm:max-w-[160px] md:flex overflow-hidden",
    children: [
      createElement("span", {
        className: "truncate text-xs font-semibold text-slate-700",
        text: audioTitle,
      }),
      createElement("span", {
        className: "text-[10px] text-leaf uppercase tracking-wider font-medium",
        text: "Música de fundo",
      }),
    ],
  });

  // Volume icon button (mute toggle)
  const volumeButton = createElement("button", {
    className:
      "flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:text-serenity focus:outline-none cursor-pointer",
    attributes: {
      type: "button",
      "aria-label": "Ajustar volume",
      title: "Mudo / Volume",
    },
  });

  const getVolumeIcon = (vol) => {
    if (vol === 0 || audio.muted) {
      return `
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      `;
    }
    if (vol < 0.5) {
      return `
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      `;
    }
    return `
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    `;
  };

  volumeButton.innerHTML = getVolumeIcon(audio.volume);

  // Volume slider
  const volumeSlider = createElement("input", {
    className:
      "volume-slider h-1.5 w-16 sm:w-20 cursor-pointer rounded-lg bg-light-gray accent-serenity",
    attributes: {
      type: "range",
      min: "0",
      max: "1",
      step: "0.01",
      value: String(audio.volume),
      "aria-label": "Controle de volume",
    },
  });

  const updateVolumeUI = () => {
    const effectiveVol = audio.muted ? 0 : audio.volume;
    volumeSlider.value = String(effectiveVol);
    volumeButton.innerHTML = getVolumeIcon(effectiveVol);
  };

  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = val === 0;
    if (val > 0) previousVolume = val;
    updateVolumeUI();
  });

  volumeButton.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolume > 0 ? previousVolume : 0.6;
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
    }
    updateVolumeUI();
  });

  const play = async () => {
    try {
      await audio.play();
      isPlaying = true;
      playButton.innerHTML = pauseIconSvg;
      playButton.setAttribute("aria-label", "Pausar música");
      setEqualizerActive(true);
      return true;
    } catch (err) {
      console.warn("Autoplay was blocked or not allowed yet:", err);
      isPlaying = false;
      playButton.innerHTML = playIconSvg;
      playButton.setAttribute("aria-label", "Tocar música");
      setEqualizerActive(false);
      return false;
    }
  };

  const pause = () => {
    audio.pause();
    isPlaying = false;
    playButton.innerHTML = playIconSvg;
    playButton.setAttribute("aria-label", "Tocar música");
    setEqualizerActive(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  playButton.addEventListener("click", togglePlay);

  card.append(equalizer, playButton, trackInfo, volumeButton, volumeSlider);
  container.append(card);

  return {
    element: container,
    play,
    pause,
    togglePlay,
    getAudio: () => audio,
    getIsPlaying: () => isPlaying,
    setVolume: (val) => {
      audio.volume = Math.max(0, Math.min(1, val));
      updateVolumeUI();
    },
  };
};
