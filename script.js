/**
 * ==========================================================================
 * LỄ DẠM NGÕ - FULLSCREEN 3D FLIP CARD & BACKGROUND MUSIC CONTROLLER
 * ==========================================================================
 */

// ==========================================================================
// 🎵 DANH SÁCH NHẠC NỀN (PLAYLIST):
// Tự động phát bài đầu tiên và tự chuyển bài tiếp theo khi hết bài
// ==========================================================================
const MUSIC_PLAYLIST = [
  "assets/mp3/ngay_hanh_phuc.mp3",
  "assets/mp3/don_gian_anh_yeu_em.mp3",
  "assets/mp3/ngoi_nha_hanh_phuc.mp3",
  "assets/mp3/khi_hoan_chau_cach_cach.mp3",
  "assets/mp3/noi_gio_len.mp3",
  "assets/mp3/ngay_hanh_phuc_lofi.mp3"
];

// ==========================================================================
// ⏱️ CẤU HÌNH THỜI GIAN HIỂN THỊ TỰ ĐỘNG TỪNG TRANG:
// Thời gian dừng lại để người xem đọc thiệp trước khi tự động chuyển trang (ms)
// ==========================================================================
const PAGE_1_DURATION = 35000; // Trang 1 (Tên & Ngày): 35 giây
const PAGE_2_DURATION = 32000; // Trang 2 (Đoạn thơ): 32 giây

let currentTrackIndex = 0;
let currentScene = 1;
let autoSceneTimeout = null;
let isMusicPlaying = false;

// DOM Elements
const bgMusic = document.getElementById('bg-music');
const musicSource = document.getElementById('music-source');
const musicControl = document.getElementById('music-control');
const musicIcon = document.getElementById('music-icon');

/**
 * Schedule Next Automatic Scene Transition
 */
function scheduleNextScene() {
  if (autoSceneTimeout) clearTimeout(autoSceneTimeout);
  const delay = currentScene === 1 ? PAGE_1_DURATION : PAGE_2_DURATION;
  autoSceneTimeout = setTimeout(() => {
    nextScene();
  }, delay);
}

/**
 * Switch Scene by Index
 */
function showScene(sceneIndex) {
  const scene1 = document.getElementById('scene-1');
  const scene2 = document.getElementById('scene-2');
  if (!scene1 || !scene2) return;

  currentScene = sceneIndex;
  if (currentScene === 1) {
    scene2.classList.remove('active');
    scene1.classList.add('active');
  } else {
    scene1.classList.remove('active');
    scene2.classList.add('active');
  }
  scheduleNextScene();
}

/**
 * Toggle to Next Scene & reset timer
 */
function nextScene() {
  showScene(currentScene === 1 ? 2 : 1);
}

/**
 * Start Automated Scene Loop
 */
function startAutoSceneLoop() {
  scheduleNextScene();
}

/**
 * Shuffle Playlist (Fisher-Yates Algorithm)
 */
function shufflePlaylist(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Load Track by Index
 */
function loadTrack(index) {
  if (!bgMusic || !musicSource || MUSIC_PLAYLIST.length === 0) return;
  currentTrackIndex = (index + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
  musicSource.src = MUSIC_PLAYLIST[currentTrackIndex];
  bgMusic.load();
}

/**
 * Initialize Audio Source & Shuffle on Page Load
 */
function initAudio() {
  shufflePlaylist(MUSIC_PLAYLIST);
  loadTrack(0);
}

/**
 * Play Next Track Automatically
 */
function playNextTrack() {
  loadTrack(currentTrackIndex + 1);
  if (isMusicPlaying) {
    bgMusic.play().catch(err => console.log("Play error:", err));
  }
}

/**
 * Toggle Background Music Play / Pause
 */
function toggleMusic() {
  if (!bgMusic) return;

  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    if (musicControl) musicControl.classList.remove('playing');
    if (musicIcon) musicIcon.textContent = '🔇';
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicControl) musicControl.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
    }).catch(err => {
      console.log("Audio waiting for user gesture:", err);
    });
  }
}

/**
 * Attempt audio playback on first user gesture (Browser autoplay policy)
 */
function handleFirstGesture() {
  if (!isMusicPlaying && bgMusic && MUSIC_PLAYLIST.length > 0) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicControl) musicControl.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
    }).catch(() => {});
  }
  document.removeEventListener('click', handleFirstGesture);
  document.removeEventListener('touchstart', handleFirstGesture);
}

// Log diagnostic confirmation
console.log("3D Fullscreen Card Initialized. Background music loaded.");

// Initialize on Document Load
document.addEventListener('DOMContentLoaded', () => {
  startAutoSceneLoop();
  initAudio();

  // Automatically play next song in playlist when current track finishes
  if (bgMusic) {
    bgMusic.addEventListener('ended', playNextTrack);
  }

  // Listen for user gestures to start audio
  document.addEventListener('click', handleFirstGesture);
  document.addEventListener('touchstart', handleFirstGesture);
});
