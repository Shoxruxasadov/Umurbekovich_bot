const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// TOKEN — o‘zingizning bot tokeningizni yozing
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Bu yerda kanal usernamesini yozing
const channels = [
    { name: 'Umurbekovich | Blog', url: 'https://t.me/umurbekovich', username: '@umurbekovich' }
];

const buttons = channels.map(channel => [{
    text: channel.name,
    url: channel.url
}]);

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    let notSubscribed = [];

    for (let channel of channels) {
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
        bot.sendMessage(chatId, "Iltimos, quyidagi kanalga obuna bo‘ling:\n\nObuna bo‘lgan bo‘lsangiz, /start ni qaytadan yuboring.", {
            reply_markup: { inline_keyboard: buttons }
        });
    } else {
        if (!sentUsers.has(chatId)) {
            sentUsers.add(chatId);
            await bot.sendMessage(chatId, 'Rahmat! Siz barcha kanalga obuna bo‘lgansiz. Mana sizga fayl.');
        }

        await bot.sendDocument(chatId, fs.createReadStream("Maxsus qo'llanma.png"), {
            caption: "Iltimos, bu faylni boshqalar bilan ulashmang.",
            protect_content: true
        });
    }
});
