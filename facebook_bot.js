'''
const login = require("facebook-chat-api");
const { spawn } = require("child_process");

login({
    appState: require("./cookiesA.json") // Cookie acc A đã lưu
}, (err, api) => {
    if(err) return console.error(err);

    api.listenMqtt((err, message) => {
        if (message.type === "message") {
            console.log("[INCOMING]", message.body);

            const python = spawn("python3", ["chatgpt_bridge.py", message.body, message.threadID]);

            python.stdout.on("data", (data) => {
                const reply = data.toString();
                console.log("[REPLY]", reply);

                // Dùng acc clone B để gửi (có thể đổi thành acc khác hoặc api.sendMessage)
                api.sendMessage(reply, message.threadID);
            });
        }
    });
});
'''