const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// TOKEN — o‘zingizning bot tokeningizni yozing
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Bu yerda kanal usernamesini yozing
const requiredChannels = ['@umurbekovich'];

const channels = [
    { name: 'Umurbekovich | Blog', url: 'https://t.me/umurbekovich' }
  ];

  const buttons = channels.map(channel => [{
    text: channel.name,
    url: channel.url
  }]);

// Fayl manzili
const filePath = path.join(__dirname, 'file.png');

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
        bot.sendMessage(chatId, "Iltimos, quyidagi kanallarga obuna bo‘ling:", {
            reply_markup: {
              inline_keyboard: buttons
            }
          });
    } else {
        bot.sendMessage(chatId, 'Rahmat! Siz barcha kanallarga obuna bo‘lgansiz. Mana sizga fayl:');
        bot.sendDocument(chatId, {
            source: filePath,
            filename: "Maxsus qo'llanma.png"
          }, {
            protect_content: true,
            caption: "Iltimos, bu faylni boshqalar bilan ulashmang."
          });
    }
});
