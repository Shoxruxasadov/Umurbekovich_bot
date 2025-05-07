const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// TOKEN — o‘zingizning bot tokeningizni yozing
const token = '7784691375:AAGXwH-QQyZ0f1O474UVKPfJzBDRkCsg-f4';
const bot = new TelegramBot(token, { polling: true });

// Bu yerda kanal usernamesini yozing
const requiredChannels = ['@umurbekovich'];

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    let notSubscribed = [];

    for (let channel of requiredChannels) {
        try {
            const member = await bot.getChatMember(channel, chatId);
            if (['left', 'kicked'].includes(member.status)) {
                notSubscribed.push(channel);
            }
        } catch (e) {
            notSubscribed.push(channel);
        }
    }

    if (notSubscribed.length > 0) {
        const channelsList = notSubscribed.map(ch => `👉 ${ch}`).join('\n');
        bot.sendMessage(chatId, `Iltimos, quyidagi kanallarga obuna bo‘ling:\n\n${channelsList}\n\nObuna bo‘lgach /start ni qaytadan bosing.`);
    } else {
        bot.sendMessage(chatId, 'Rahmat! Siz barcha kanallarga obuna bo‘lgansiz. Mana sizga fayl:');
        bot.sendDocument(chatId, fs.createReadStream('file.png'));
    }
});
