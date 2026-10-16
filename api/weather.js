export default async function handler(req, res) {
  const city = (req.query.city || '').trim();

  if (!city) {
    return res.status(400).json({
      error: "We couldn't find that city. Please check the spelling and try again."
    });
  }

  const key = process.env.WEATHER_API_KEY;

  if (!key) {
    return res.status(500).json({
      error: "The weather service is unavailable right now. Please try again later."
    });
  }

  let data;
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    data = await response.json();
  } catch {
    return res.status(500).json({
      error: "The weather service is unavailable right now. Please try again later."
    });
  }

  if (data.error) {
    const code = data.error.code;
    if (code === 1003 || code === 1006) {
      return res.status(404).json({
        error: "We couldn't find that city. Please check the spelling and try again."
      });
    }
    return res.status(500).json({
      error: "The weather service is unavailable right now. Please try again later."
    });
  }

  return res.status(200).json({
    city:        data.location.name,
    country:     data.location.country,
    localTime:   data.location.localtime,
    description: data.current.condition.text,
    icon:        data.current.condition.icon,
    tempC:       data.current.temp_c,
    feelsLikeC:  data.current.feelslike_c,
    humidity:    data.current.humidity,
    windKph:     data.current.wind_kph,
    windDir:     data.current.wind_dir
  });
}
