const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', async(req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Use an API to get the location and weather info based on IP
        const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const { city, lat, lon } = locationResponse.data;

        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const temperature = weatherResponse.data.current_weather.temperature;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving location or weather data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});