const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// 静的ファイルを提供するフォルダを設定
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
console.log('Serving static files from:', path.join(__dirname, 'public'));

// データを保存する関数
function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data));
}

// データを読み込む関数
function loadData() {
    if (fs.existsSync('data.json')) {
        const rawData = fs.readFileSync('data.json');
        return JSON.parse(rawData);
    }
    return []; // ファイルが存在しない場合は空の配列を返す
}

// 初期データを読み込む
let dataStore = loadData();

// CORSの設定：手動でヘッダーを追加
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 任意のオリジンからアクセスを許可
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 許可するメソッド
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 許可するヘッダー
    next();
});

// ルートにアクセスしたときにindex.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// データを取得するエンドポイント
app.get('/api/data', (req, res) => {
    res.json(dataStore);
});

// データを保存するエンドポイント
app.post('/api/data', (req, res) => {
    const newData = req.body;
    dataStore.push(newData); // 新しいデータを追加
    saveData(dataStore); // ファイルに保存
    res.status(201).json({ message: 'データ保存成功', data: newData });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});





// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const app = express();
// const port = 3000;

// // 静的ファイルを提供するフォルダを設定
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// console.log('Serving static files from:', path.join(__dirname, 'public'));

// const DATA_FILE = 'data.json';

// // データを保存する関数
// function saveData(data) {
//     fs.writeFileSync(DATA_FILE, JSON.stringify(data));
// }

// // データを読み込む関数
// function loadData() {
//     if (fs.existsSync(DATA_FILE)) {
//         const rawData = fs.readFileSync(DATA_FILE);
//         return JSON.parse(rawData);
//     }
//     return []; // ファイルが存在しない場合は空の配列を返す
// }

// // 初期データを読み込む
// let dataStore = loadData();

// // ルートにアクセスしたときにindex.htmlを返す
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // データを取得するエンドポイント
// app.get('/api/data', (req, res) => {
//     res.json(dataStore);
// });

// // データを保存するエンドポイント
// app.post('/api/data', (req, res) => {
//     const newData = req.body;
//     dataStore.push(newData); // 新しいデータを追加
//     saveData(dataStore); // ファイルに保存
//     res.status(201).json({ message: 'データ保存成功', data: newData });
// });

// // サーバーを起動
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });



