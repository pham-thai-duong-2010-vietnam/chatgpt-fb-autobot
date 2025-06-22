const login = require("facebook-chat-api");
const { spawn } = require("child_process");
const http = require("http");

// Đăng nhập bằng cookies acc A (đã lưu vào cookiesA.json)
login({ appState: require("./cookiesA.json") }, (err, api) => {
    if (err) {
        console.error("❌ Lỗi đăng nhập Facebook:", err);
        return;
    }

    console.log("✅ Bot đã đăng nhập FB và sẵn sàng rep...");

    // Lắng nghe tin nhắn mới
    api.listenMqtt((err, message) => {
        if (err || !message || message.type !== "message") return;

        const content = message.body;
        const threadID = message.threadID;

        console.log("📩 Tn đến:", content);

        // Gọi sang file Python để hỏi ChatGPT
        const python = spawn("python3", ["chatgpt_bridge.py", content, threadID]);

        // Nhận câu trả lời từ ChatGPT
        python.stdout.on("data", (data) => {
            const reply = data.toString().trim();
            console.log("🤖 Trả lời:", reply);

            // Gửi lại tin nhắn từ acc clone
            api.sendMessage(reply, threadID);
        });

        python.stderr.on("data", (data) => {
            console.error("❗ Python lỗi:", data.toString());
        });
    });
});

// ==============================
// HTTP Server giữ bot luôn online (cho UptimeRobot ping)
// ==============================
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("🤖 FB Autobot still alive at " + new Date().toISOString());
}).listen(PORT, () => {
    console.log(`🌐 HTTP server chạy tại port ${PORT} (ping bởi UptimeRobot)`);
});
