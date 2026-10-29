// 定義全域變數，用於儲存角色精靈與動畫資源
let character;
let animFly;
let animKick; 

// 預先載入圖片與動畫資源，確保遊戲開始前檔案皆已下載完畢
function preload() {
// 載入起飛（飛行）動畫
// 修正：p5.play V3 讀取精靈圖的正確語法為 frames，而非 frameCount
animFly = loadAnimation('1/起飛/起飛.png', {
frameSize: [715 / 9, 91], // 計算單張影格的寬高（總寬度715平分給9張影格）
frames: 9                // 共有9張影格（官方正確屬性名稱）
}); 

// 載入踢腿動畫
animKick = loadAnimation('1/踢腿/踢腿.png', {
frameSize: [733 / 9, 93], // 計算單張影格的寬高（總寬度733平分給9張影格）
frames: 9                // 共有9張影格（官方正確屬性名稱）
});
} 

// 初始化設定，在網頁載入時只執行一次
function setup() {
// 建立一個符合瀏覽器視窗大小的全螢幕畫布
// 提示：在 p5.play V3 中也可以直接使用 new Canvas(windowWidth, windowHeight);
createCanvas(windowWidth, windowHeight); 

// 在畫布正中央（寬度一半、高度一半的位置）產生角色精靈
character = new Sprite(windowWidth / 2, windowHeight / 2); 

// 將載入的動畫綁定到精靈上，並分別給予 fly 與 kick 的名稱標籤
character.addAnims({
fly: animFly,
kick: animKick
}); 

// 遊戲初始預設循環播放起飛（飛行）動畫
character.changeAnim('fly');
} 

// 主要繪圖與邏輯更新循環，每秒自動執行約60次
function draw() {
// 設定畫布背景顏色為指定的特定米黃色調（#faedcd）
background('#faedcd'); 

// 偵測鍵盤按鍵狀態，動態控制角色的移動、動畫切換與鏡像轉向
if (kb.holding('right')) {
// 當使用者按住鍵盤「向右鍵」時
character.changeAnim('fly');   // 一樣顯示起飛（飛行）動畫
character.mirror.x = false;   // 確保角色面朝右側（不進行水平翻轉）
character.vel.x = 4;          // 設定向右移動的速度
} else if (kb.holding('left')) {
// 當使用者按住鍵盤「向左鍵」時
character.changeAnim('kick');  // 改為顯示踢腿動畫
character.mirror.x = true;    // 將角色精靈做水平翻轉動作，使其面朝左側
character.vel.x = -4;         // 設定向左移動的速度
} else {
// 當放開按鍵、沒有按下任何方向鍵時
character.changeAnim('fly');   // 停在原地時恢復為預設的循環顯示起飛動畫
character.vel.x = 0;          // 水平移動速度歸零，讓角色停止移動
}
} 

// 當瀏覽器視窗大小被改變時，自動觸發此函式以調整網頁佈局
function windowResized() {
// 將畫布大小動態調整為目前最新的視窗寬與高
resizeCanvas(windowWidth, windowHeight);
}