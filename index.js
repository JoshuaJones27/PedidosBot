require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

// Create a bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

const menuOptions = {
    reply_markup: {
      keyboard: [
        ['/start', '/help'],
        ['/bia', '/weather']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const response = 'Hello! Welcome to my bot.';
    // Send the menu to the user
    bot.sendMessage(chatId, response, menuOptions);
});
  
  // Listen for the /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const response = 'How can I help you?';
    // Send the menu to the user
    bot.sendMessage(chatId, response, menuOptions);
});
  
  // Listen for the /bia command
bot.onText(/\/bia/, (msg) => {
    const chatId = msg.chat.id;
    const response = 'Beatriz Morim!';
    // Send the menu to the user
    bot.sendMessage(chatId, response, menuOptions);
});

bot.onText(/\/weather/, async (msg) => {
    const chatId = msg.chat.id;
    // Ask the user to send their location
    bot.sendMessage(chatId, 'Please share your location:', {
      reply_markup: {
        keyboard: [[{ text: 'Share Location', request_location: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  });
  
  // Listen for the user's location
  bot.on('location', async (msg) => {
    const chatId = msg.chat.id;
    const latitude = msg.location.latitude;
    const longitude = msg.location.longitude;
  
    // Fetch the weather information for the location from the OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;
  
    if (response.status === 200) {
      // Send the weather information to the user
      const location = `${data.name}, ${data.sys.country}`;
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherInfo = `Weather for ${location}: ${weatherDescription}\nTemperature: ${temperature}°C\nHumidity: ${humidity}%\nWind Speed: ${windSpeed} m/s`;
      bot.sendMessage(chatId, weatherInfo, menuOptions);
    } else {
      // Send an error message to the user
      const errorMessage = `Could not get weather information for your location. Please try again later.`;
      bot.sendMessage(chatId, errorMessage, menuOptions);
    }
});