// 宣告待機／起飛精靈圖的檔案路徑。
const TAKEOFF_IMAGE_PATH = "1/起飛/起飛.png";

// 宣告向右移動時使用的踢腿精靈圖檔案路徑。
const KICK_IMAGE_PATH = "1/踢腿/踢腿.png";

// 設定起飛精靈圖的完整寬度。
const TAKEOFF_SHEET_WIDTH = 715;

// 設定起飛精靈圖的完整高度。
const TAKEOFF_SHEET_HEIGHT = 91;

// 設定踢腿精靈圖的完整寬度。
const KICK_SHEET_WIDTH = 733;

// 設定踢腿精靈圖的完整高度。
const KICK_SHEET_HEIGHT = 93;

// 設定兩張橫向精靈圖都包含九個動畫畫格。
const FRAME_COUNT = 9;

// 設定每秒播放的動畫畫格數。
const ANIMATION_FPS = 10;

// 設定角色每一幀移動的像素數。
const MOVE_SPEED = 4;

// 載入待機／起飛精靈圖的變數。
let takeoffSheet;

// 載入向右移動踢腿精靈圖的變數。
let kickSheet;

// 記錄待機／起飛圖片是否成功載入。
let takeoffImageLoaded = false;

// 記錄踢腿圖片是否成功載入。
let kickImageLoaded = false;

// 記錄是否有任何圖片載入失敗。
let imageLoadError = false;

// 記錄目前要顯示的動畫名稱。
let currentAnimation = "takeoff";

// 記錄角色是否正在移動。
let isMoving = false;

// 記錄角色是否面向左方。
let facingLeft = false;

// 記錄角色在畫布上的水平座標。
let characterX = 0;

// 記錄角色在畫布上的垂直座標。
let characterY = 0;

// 記錄角色目前播放的畫格編號。
let currentFrame = 0;

// 記錄上一次更新動畫畫格的時間。
let lastAnimationTime = 0;

// preload 會在 setup 執行前先載入外部圖片資源。
function preload() {
  // 載入待機／起飛精靈圖，並在載入完成或失敗時執行對應函式。
  takeoffSheet = loadImage(
    TAKEOFF_IMAGE_PATH,
    function () {
      // 圖片成功載入後，標記待機／起飛圖片可以使用。
      takeoffImageLoaded = true;
    },
    function () {
      // 圖片載入失敗時，記錄錯誤但不讓程式停止執行。
      imageLoadError = true;
    }
  );

  // 載入向右移動踢腿精靈圖，並在載入完成或失敗時執行對應函式。
  kickSheet = loadImage(
    KICK_IMAGE_PATH,
    function () {
      // 圖片成功載入後，標記踢腿圖片可以使用。
      kickImageLoaded = true;
    },
    function () {
      // 圖片載入失敗時，記錄錯誤但不讓程式停止執行。
      imageLoadError = true;
    }
  );
}

// setup 只會在 p5.js 程式開始時執行一次。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定繪圖模式，使座標從圖片中心開始計算。
  imageMode(CENTER);

  // 設定矩形與圖片繪製不使用外框線。
  noStroke();

  // 將角色放在畫布正中央。
  characterX = width / 2;

  // 將角色放在畫布正中央。
  characterY = height / 2;

  // 使用毫秒時間初始化動畫計時器。
  lastAnimationTime = millis();
}

// draw 會以每秒多次的頻率持續執行，負責畫面更新與動畫播放。
function draw() {
  // 使用指定的淡黃色作為全螢幕背景色。
  background("#faedcd");

  // 依照目前按住的方向鍵更新角色狀態與位置。
  updateMovement();

  // 依照經過的時間切換精靈動畫畫格。
  updateAnimation();

  // 繪製目前應該顯示的角色精靈或錯誤替代畫面。
  drawCharacter();
}

// 根據鍵盤狀態更新角色動畫、方向與座標。
function updateMovement() {
  // 優先處理右方向鍵，讓角色播放踢腿動畫並向右移動。
  if (keyIsDown(RIGHT_ARROW)) {
    // 將目前動畫切換成向右移動的踢腿動畫。
    currentAnimation = "kick";

    // 將角色設定為面向右方。
    facingLeft = false;

    // 標記角色目前正在移動。
    isMoving = true;

    // 將角色向右移動指定的速度。
    characterX += MOVE_SPEED;
  }
  // 如果沒有按住右鍵，就檢查是否按住左方向鍵。
  else if (keyIsDown(LEFT_ARROW)) {
    // 將目前動畫切換成待機／起飛動畫。
    currentAnimation = "takeoff";

    // 將角色設定為面向左方。
    facingLeft = true;

    // 標記角色目前正在移動。
    isMoving = true;

    // 將角色向左移動指定的速度。
    characterX -= MOVE_SPEED;
  }
  // 沒有按住任何方向鍵時，角色回到待機／起飛動畫。
  else {
    // 將目前動畫切換成待機／起飛動畫。
    currentAnimation = "takeoff";

    // 標記角色目前沒有移動。
    isMoving = false;
  }

  // 取得目前動畫畫格的顯示寬度，供邊界判斷使用。
  const halfCharacterWidth = getCurrentFrameWidth() / 2;

  // 將角色限制在畫布左邊界內，避免角色完全移出畫面。
  characterX = constrain(characterX, halfCharacterWidth, width - halfCharacterWidth);
}

// 依照時間控制精靈圖的九格循環播放。
function updateAnimation() {
  // 取得目前時間，以毫秒為單位。
  const currentTime = millis();

  // 計算每一個動畫畫格應該停留的毫秒數。
  const frameDuration = 1000 / ANIMATION_FPS;

  // 當經過的時間達到一個畫格的時間時，切換到下一格。
  if (currentTime - lastAnimationTime >= frameDuration) {
    // 依照九個畫格循環播放，超過最後一格後回到第一格。
    currentFrame = (currentFrame + 1) % FRAME_COUNT;

    // 記錄這次切換畫格的時間。
    lastAnimationTime = currentTime;
  }
}

// 取得目前動畫單一畫格的顯示寬度。
function getCurrentFrameWidth() {
  // 向右移動時使用踢腿精靈圖的單格寬度。
  if (currentAnimation === "kick") {
    // 回傳踢腿精靈圖完整寬度除以九格的結果。
    return KICK_SHEET_WIDTH / FRAME_COUNT;
  }

  // 其他狀態使用起飛精靈圖的單格寬度。
  return TAKEOFF_SHEET_WIDTH / FRAME_COUNT;
}

// 取得目前動畫單一畫格的顯示高度。
function getCurrentFrameHeight() {
  // 向右移動時使用踢腿精靈圖的單格高度。
  if (currentAnimation === "kick") {
    // 回傳踢腿精靈圖的完整高度。
    return KICK_SHEET_HEIGHT;
  }

  // 其他狀態使用起飛精靈圖的完整高度。
  return TAKEOFF_SHEET_HEIGHT;
}

// 依照目前畫格從橫向精靈圖中切出並繪製角色。
function drawCharacter() {
  // 先取得目前動畫應使用的圖片物件。
  const currentSheet = currentAnimation === "kick" ? kickSheet : takeoffSheet;

  // 先確認目前圖片物件存在且已經完成載入。
  const currentImageLoaded = currentAnimation === "kick" ? kickImageLoaded : takeoffImageLoaded;

  // 取得目前精靈圖單格的原始寬度。
  const frameWidth = getCurrentFrameWidth();

  // 取得目前精靈圖單格的原始高度。
  const frameHeight = getCurrentFrameHeight();

  // 依照畫布尺寸計算適合全螢幕顯示的角色大小。
  const displayScale = constrain(min(width, height) / 360, 1, 2.4);

  // 計算精靈圖畫格在畫面上的寬度。
  const displayWidth = frameWidth * displayScale;

  // 計算精靈圖畫格在畫面上的高度。
  const displayHeight = frameHeight * displayScale;

  // 儲存目前的繪圖設定，避免影響其他畫面元素。
  push();

  // 將繪圖原點移到角色位置。
  translate(characterX, characterY);

  // 角色面向左方時，將水平縮放設為負值以完成左右翻轉。
  scale(facingLeft ? -1 : 1, 1);

  // 如果圖片已成功載入，就從精靈圖裁切出目前畫格。
  if (currentImageLoaded && currentSheet) {
    // 使用 p5.js image 的來源區域參數，只繪製橫向精靈圖中的單格。
    image(
      currentSheet,
      0,
      0,
      displayWidth,
      displayHeight,
      currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight
    );
  }
  // 圖片尚未載入或路徑錯誤時，繪製不會崩潰的替代角色。
  else {
    // 設定替代角色的填滿顏色。
    fill("#d4a373");

    // 繪製替代角色的身體區域。
    ellipse(0, 0, displayWidth, displayHeight);

    // 設定提示文字的對齊方式。
    textAlign(CENTER, CENTER);

    // 設定提示文字大小。
    textSize(12 * displayScale);

    // 設定提示文字顏色。
    fill("#6b4226");

    // 顯示圖片載入中的提示，協助檢查檔案路徑。
    text(imageLoadError ? "圖片路徑錯誤" : "圖片載入中", 0, 0);
  }

  // 還原進入本函式前的繪圖設定。
  pop();
}

// p5.js 在瀏覽器視窗尺寸改變時會呼叫此函式。
function windowResized() {
  // 重新調整畫布大小，使畫布持續填滿整個瀏覽器視窗。
  resizeCanvas(windowWidth, windowHeight);

  // 將角色重新限制在調整後的畫布範圍內。
  characterX = constrain(characterX, 0, width);

  // 將角色垂直位置維持在新的畫布中央。
  characterY = height / 2;
}

// p5.js 在使用者按下鍵盤按鍵時會呼叫此函式。
function keyPressed() {
  // 按下右方向鍵時，立即切換成踢腿動畫並面向右方。
  if (keyCode === RIGHT_ARROW) {
    // 設定目前動畫為踢腿動畫。
    currentAnimation = "kick";

    // 設定角色面向右方。
    facingLeft = false;

    // 設定角色正在移動。
    isMoving = true;
  }

  // 按下左方向鍵時，立即切換成起飛動畫並面向左方。
  if (keyCode === LEFT_ARROW) {
    // 設定目前動畫為起飛動畫。
    currentAnimation = "takeoff";

    // 設定角色面向左方。
    facingLeft = true;

    // 設定角色正在移動。
    isMoving = true;
  }

  // 阻止方向鍵造成網頁捲動，讓鍵盤只控制角色。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    // 回傳 false 取消瀏覽器對方向鍵的預設行為。
    return false;
  }
}

// p5.js 在使用者放開鍵盤按鍵時會呼叫此函式。
function keyReleased() {
  // 放開任一方向鍵後，讓角色停止移動；下一個 draw 仍會持續播放待機動畫。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    // 標記角色目前沒有移動。
    isMoving = false;

    // 回傳 false 取消瀏覽器對方向鍵的預設行為。
    return false;
  }
}
