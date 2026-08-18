/**
 * ==========================================================================
 * LỄ DẠM NGÕ - FULLSCREEN CARD & BACKGROUND MUSIC CONTROLLER
 * ==========================================================================
 */

// ==========================================================================
// 🎨 CẤU HÌNH THEME (CHỈ SỬA DÒNG NÀY KHI ĐỔI THEME MÀU SẮC & BỘ ẢNH):
// Đổi 'pink' thành 'green-gold' để chuyển sang bộ Nền Xanh Bạc Hà, Nụ Sen Vàng Gold & Bó Hoa Đôi Xum Xuê
// ==========================================================================
let currentTheme = 'green-gold'; // 'pink' hoặc 'green-gold'

/**
 * Tự động áp dụng theme tương ứng với currentTheme khi trang load
 * @param {string} themeName - 'pink' hoặc 'green-gold'
 */
function applyTheme(themeName) {
  currentTheme = themeName;
  if (themeName === 'green-gold') {
    document.documentElement.setAttribute('data-theme', 'green-gold');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Tự động cập nhật đường dẫn hình ảnh theo thư mục theme tương ứng (assets/pink/ hoặc assets/green-gold/)
  document.querySelectorAll('[data-asset]').forEach(img => {
    const assetName = img.getAttribute('data-asset');
    img.src = `assets/${themeName}/${assetName}`;
  });

  // Đồng bộ lại bounding box sau khi đổi theme (kích thước font có thể thay đổi)
  requestAnimationFrame(() => {
    if (typeof syncNameBoundingBoxes === 'function') syncNameBoundingBoxes();
    if (typeof syncBottomFlowerSize === 'function') syncBottomFlowerSize();
  });
}

/**
 * Chuyển đổi qua lại giữa 2 Theme ('green-gold' <-> 'pink') khi bấm vào chữ "LỄ DẠM NGÕ"
 * @param {Event} [event]
 */
function toggleTheme(event) {
  if (event) {
    event.stopPropagation();
  }
  const nextTheme = currentTheme === 'green-gold' ? 'pink' : 'green-gold';
  applyTheme(nextTheme);

  // Phản hồi thị giác cho chữ tiêu đề khi chuyển theme
  const title = document.querySelector('.card-title');
  if (title) {
    title.classList.remove('theme-pop');
    void title.offsetWidth;
    title.classList.add('theme-pop');
  }
}

// Khai báo các hàm toàn cục
window.setCardTheme = applyTheme;
window.toggleTheme = toggleTheme;

// ==========================================================================
// 📐 ĐỒNG BỘ BOUNDING BOX TÊN CÔ DÂU & CHÚ RỂ
// Bố cục: [Góc trái] + [Gap] + [Border Trái] + [Gap] + [囍] + [Gap] + [Border Phải] + [Gap] + [Góc Phải]
// Tất cả 4 khoảng [Gap] đều bằng nhau trên mọi kích thước màn hình.
// Công thức: Gap = (wrapperWidth - 2 × maxNameWidth - xiWidth) / 4
// ==========================================================================
function syncNameBoundingBoxes() {
  const wrapper = document.querySelector('.couple-names-wrapper');
  const nameLeft = document.querySelector('.name-left');
  const nameRight = document.querySelector('.name-right');
  const nameBoxLeft = document.querySelector('.name-left .name-box');
  const nameBoxRight = document.querySelector('.name-right .name-box');
  const xiCrest = document.querySelector('.center-xi-crest');
  if (!wrapper || !nameLeft || !nameRight || !nameBoxLeft || !nameBoxRight || !xiCrest) return;

  // Reset trước khi đo để lấy kích thước tự nhiên
  nameLeft.style.minWidth = '';
  nameLeft.style.minHeight = '';
  nameLeft.style.marginRight = '';
  nameRight.style.minWidth = '';
  nameRight.style.minHeight = '';
  nameRight.style.marginLeft = '';

  // Đo kích thước tự nhiên của .name-box bên trong
  const leftRect = nameBoxLeft.getBoundingClientRect();
  const rightRect = nameBoxRight.getBoundingClientRect();

  // Lấy kích thước lớn nhất giữa 2 bên làm Bounding Box đồng nhất
  const maxW = Math.ceil(Math.max(leftRect.width, rightRect.width));
  const maxH = Math.ceil(Math.max(leftRect.height, rightRect.height));

  // Gán min-width & min-height đồng nhất cho cả 2 name-block
  nameLeft.style.minWidth = maxW + 'px';
  nameLeft.style.minHeight = maxH + 'px';
  nameRight.style.minWidth = maxW + 'px';
  nameRight.style.minHeight = maxH + 'px';

  // Đo kích thước wrapper và 囍
  const wrapperWidth = wrapper.clientWidth;
  const xiWidth = xiCrest.getBoundingClientRect().width;

  // Tính Gap đều: Gap = (wrapperWidth - 2*maxW - xiWidth) / 4
  let gap = (wrapperWidth - 2 * maxW - xiWidth) / 4;
  gap = Math.max(gap, 10); // Đảm bảo tối thiểu 10px

  // Margin từ Border tới 囍 = Gap + xiWidth/2 (vì 囍 absolute nằm giữa)
  const marginToXi = gap + xiWidth / 2;
  nameLeft.style.marginRight = marginToXi + 'px';
  nameRight.style.marginLeft = marginToXi + 'px';
}

// ==========================================================================
// 🌸 THU NHỎ HOA GÓC DƯỚI KHI CHẠM BORDER NGÀY THÁNG
// Đo vùng bounding box của .card-bottom-group (ngày tháng).
// Nếu .asset-bl hoặc .asset-br chạm vào vùng này → thu nhỏ hoa cho đến khi
// không còn chồng lấn. Nếu không chạm → giữ nguyên kích thước gốc.
// ==========================================================================
function syncBottomFlowerSize() {
  const dateBox = document.querySelector('.card-bottom-group');
  const flowerBL = document.querySelector('.asset-bl');
  const flowerBR = document.querySelector('.asset-br');
  if (!dateBox || !flowerBL || !flowerBR) return;

  const dateRect = dateBox.getBoundingClientRect();

  // Xử lý cho từng bông hoa góc dưới
  [flowerBL, flowerBR].forEach(flower => {
    // Reset scale về 1 trước khi đo
    flower.style.transform = '';
    const flowerRect = flower.getBoundingClientRect();

    // Kiểm tra chồng lấn (2 rect giao nhau)
    const overlaps =
      flowerRect.left < dateRect.right &&
      flowerRect.right > dateRect.left &&
      flowerRect.top < dateRect.bottom &&
      flowerRect.bottom > dateRect.top;

    if (overlaps) {
      // Tính tỷ lệ thu nhỏ cần thiết để không chồng lấn
      // Hoa nằm ở góc dưới, cần đảm bảo đỉnh hoa không vượt lên quá đáy date box
      const flowerHeight = flowerRect.height;
      const overlapTop = dateRect.bottom - flowerRect.top;
      if (overlapTop > 0 && flowerHeight > 0) {
        const targetHeight = flowerHeight - overlapTop - 5; // 5px margin an toàn
        let scaleFactor = targetHeight / flowerHeight;
        scaleFactor = Math.max(scaleFactor, 0.5); // Không thu nhỏ quá 50%
        flower.style.transform = `scale(${scaleFactor.toFixed(3)})`;
        flower.style.transformOrigin = flower.classList.contains('asset-bl')
          ? 'bottom left'
          : 'bottom right';
      }
    }
  });
}

// Chạy lại khi thay đổi kích thước cửa sổ
let _syncRAF = null;
window.addEventListener('resize', () => {
  if (_syncRAF) cancelAnimationFrame(_syncRAF);
  _syncRAF = requestAnimationFrame(() => {
    syncNameBoundingBoxes();
    syncBottomFlowerSize();
  });
});

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
  "assets/mp3/ngay_hanh_phuc_lofi.mp3",
  "assets/mp3/i_do.mp3",
  "assets/mp3/perfect.mp3",
  "assets/mp3/beautiful_in_white.mp3",
  "assets/mp3/my_love.mp3",
  // "assets/mp3/everytime_we_touch.mp3",
  // "assets/mp3/a_little_love.mp3",
  // "assets/mp3/anh_nang_cua_anh.mp3",
  // "assets/mp3/cuoi_nhau_di.mp3",
  // "assets/mp3/duong_quyen_tinh_yeu.mp3",
  // "assets/mp3/may_hong_dua_loi.mp3",
  // "assets/mp3/minh_yeu_nhau_di.mp3",
  // "assets/mp3/sugar.mp3",
  // "assets/mp3/tinh_yeu_mau_hong_lofi.mp3",
  // "assets/mp3/until_you.mp3",
  // "assets/mp3/vo_tuyet_voi_nhat.mp3",
  // "assets/mp3/what_makes_you_beautiful.mp3",
  // "assets/mp3/yeu_anh_cu_de_em.mp3"
];

// ==========================================================================
// ⏱️ CẤU HÌNH THỜI GIAN HIỂN THỊ TỰ ĐỘNG TỪNG TRANG:
// Thời gian dừng lại để người xem đọc thiệp trước khi tự động chuyển trang (ms)
// ==========================================================================
const PAGE_1_DURATION = 35000; // Trang 1 (Tên & Ngày): 35 giây
const PAGE_2_DURATION = 32000; // Trang 2 (Đoạn thơ): 32 giây

let shuffledPlaylist = [];
let currentShuffleIndex = 0;
let currentTrackIndex = 0;
let currentScene = 1;
let autoSceneTimeout = null;
let isMusicPlaying = false;

// DOM Elements
const bgMusic = document.getElementById('bg-music');
const musicSource = document.getElementById('music-source');

/**
 * Cập nhật giao diện nút Bông sen góc phải trên khi bật/tắt nhạc
 */
function updateMusicUI(playing) {
  const lotusToggle = document.getElementById('lotus-music-toggle') || document.querySelector('.asset-tr');
  if (lotusToggle) {
    if (playing) {
      lotusToggle.classList.add('playing');
      lotusToggle.classList.remove('muted');
    } else {
      lotusToggle.classList.remove('playing');
      lotusToggle.classList.add('muted');
    }
  }
}

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
 * Generate a new random shuffle order of playlist indices.
 * Guarantees all songs are played once per cycle.
 * Prevents repeating the last track when starting a new cycle.
 */
function generateShuffleOrder(lastTrackIndex = -1) {
  const indices = MUSIC_PLAYLIST.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Avoid playing the exact same song back-to-back across cycle boundary
  if (indices.length > 1 && indices[0] === lastTrackIndex) {
    const swapIdx = Math.floor(Math.random() * (indices.length - 1)) + 1;
    [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
  }

  return indices;
}

/**
 * Load Track by Index in MUSIC_PLAYLIST
 */
function loadTrack(index) {
  if (!bgMusic || MUSIC_PLAYLIST.length === 0) return;
  currentTrackIndex = index;
  const targetSrc = MUSIC_PLAYLIST[currentTrackIndex];
  
  // Tạm dừng bài đang phát để hủy stream cũ sạch sẽ
  try {
    bgMusic.pause();
  } catch (e) {}

  if (musicSource) {
    musicSource.src = targetSrc;
  }
  bgMusic.src = targetSrc;
  bgMusic.load();
}

/**
 * Attempt immediate audio playback upon page access.
 * If browser policy allows, music plays instantly. If blocked, fallback to first user interaction.
 */
function attemptAutoplay() {
  if (!bgMusic || MUSIC_PLAYLIST.length === 0) return;

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isMusicPlaying = true;
      updateMusicUI(true);
      console.log("🎵 Tự động phát nhạc ngay khi truy cập trang web!");
    }).catch(err => {
      console.log("ℹ️ Trình duyệt yêu cầu tương tác đầu tiên để phát nhạc.");
      // Lắng nghe tương tác đầu tiên nếu trình duyệt bật chính sách Autoplay restriction
      document.addEventListener('click', handleFirstGesture, { once: true });
      document.addEventListener('touchstart', handleFirstGesture, { once: true });
      document.addEventListener('keydown', handleFirstGesture, { once: true });
    });
  }
}

/**
 * Initialize Audio Source & Generate First Shuffle Cycle
 */
function initAudio() {
  if (MUSIC_PLAYLIST.length === 0) return;
  shuffledPlaylist = generateShuffleOrder();
  currentShuffleIndex = 0;
  loadTrack(shuffledPlaylist[currentShuffleIndex]);
  attemptAutoplay();
}

/**
 * Advance to Next Track in the Shuffle Cycle.
 * When all tracks have been played once, a new randomized cycle starts.
 */
function advanceNextTrack() {
  if (shuffledPlaylist.length === 0) return;

  currentShuffleIndex++;
  if (currentShuffleIndex >= shuffledPlaylist.length) {
    const lastTrack = shuffledPlaylist[shuffledPlaylist.length - 1];
    shuffledPlaylist = generateShuffleOrder(lastTrack);
    currentShuffleIndex = 0;
    console.log("🎵 Đã phát hết 1 vòng Playlist! Khởi tạo vòng phát ngẫu nhiên mới không lặp lại.");
  }

  loadTrack(shuffledPlaylist[currentShuffleIndex]);
  console.log(`🎶 [Bài ${currentShuffleIndex + 1}/${shuffledPlaylist.length}] Đang phát: ${MUSIC_PLAYLIST[currentTrackIndex]}`);
}

/**
 * Play Next Track Automatically (Triggered when track ends)
 */
function playNextTrack() {
  advanceNextTrack();
  if (isMusicPlaying) {
    bgMusic.play().catch(err => {
      if (err.name !== 'AbortError') {
        console.log("Play error:", err);
      }
    });
  }
}

/**
 * Manually switch to next random track by clicking heart icon on 囍 symbol.
 */
function changeTrack(event) {
  if (event) {
    event.stopPropagation();
  }

  // Visual feedback animation on heart icons
  const heartElements = document.querySelectorAll('.heart-icon-center');
  heartElements.forEach(heart => {
    heart.classList.remove('heart-pulse');
    void heart.offsetWidth; // Trigger reflow for repeat clicks
    heart.classList.add('heart-pulse');
  });

  advanceNextTrack();

  bgMusic.play().then(() => {
    isMusicPlaying = true;
    updateMusicUI(true);
  }).catch(err => {
    // Bỏ qua log AbortError khi người dùng bấm đổi bài liên tục (trình duyệt tự hủy luồng stream cũ)
    if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
      console.log("Audio play error on change track:", err);
    }
  });
}

/**
 * Toggle Background Music Play / Pause (Bấm vào bông sen góc phải trên)
 */
function toggleMusic() {
  if (!bgMusic) return;

  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicUI(false);
  } else {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusicUI(true);
    }).catch(err => {
      if (err.name !== 'AbortError') {
        console.log("Audio waiting for user gesture:", err);
      }
    });
  }
}

/**
 * Attempt audio playback on first user gesture (Browser autoplay policy fallback)
 */
function handleFirstGesture() {
  if (!isMusicPlaying && bgMusic && MUSIC_PLAYLIST.length > 0) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusicUI(true);
    }).catch(() => {});
  }
  document.removeEventListener('click', handleFirstGesture);
  document.removeEventListener('touchstart', handleFirstGesture);
  document.removeEventListener('keydown', handleFirstGesture);
}

// Log diagnostic confirmation
console.log("3D Fullscreen Card Initialized. Active Theme:", currentTheme);

// Initialize on Document Load
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  startAutoSceneLoop();
  initAudio();

  // Đồng bộ bounding box tên cô dâu & chú rể sau khi DOM sẵn sàng
  syncNameBoundingBoxes();
  syncBottomFlowerSize();

  // Chạy lại sau khi font chữ load xong (kích thước có thể thay đổi)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncNameBoundingBoxes();
      syncBottomFlowerSize();
    });
  }

  // Automatically play next song in playlist when current track finishes
  if (bgMusic) {
    bgMusic.addEventListener('ended', playNextTrack);
  }
});
