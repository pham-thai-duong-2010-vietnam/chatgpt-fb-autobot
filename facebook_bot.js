const login = require("facebook-chat-api");
const { spawn } = require("child_process");
const http = require("http");

// Login bằng cookie đã lưu từ acc A
login({
    appState: require("./cookiesA.json")
}, (err, api) => {
    if (err) return console.error("Lỗi đăng nhập FB:", err);

    console.log("🤖 Đang lắng nghe tin nhắn...");

    api.listenMqtt((err, message) => {
        if (err || message.type !== "message") return;

        console.log("[INCOMING]", message.body);

        // Gọi file Python để nhờ ChatGPT rep
        const python = spawn("python3", ["chatgpt_bridge.py", message.body, message.threadID]);

        python.stdout.on("data", (data) => {
            const reply = data.toString().trim();
            console.log("[REPLY]", reply);

            // Gửi tin nhắn lại vào thread cũ
            api.sendMessage(reply, message.threadID);
        });
    });
});

// =============================
// Dummy HTTP server (cho UptimeRobot ping)
// =============================
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot vẫn hoạt động nha 😎");
}).listen(PORT, () => {
    console.log(`🌐 HTTP server đang chạy tại port ${PORT}`);
});
