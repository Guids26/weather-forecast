import { weatherApi } from "src/boot/axios";
import { useConfigStore } from "src/stores/useConfigStore";

export default {
  async searchCurrentMinAndMaxTemperature(latitude, longitude) {
    const { temperatureUnit } = useConfigStore();
    return await weatherApi.get(
      `/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&format=json&temperature_unit=${temperatureUnit}`
    );
  },
  async searchCompleteWeatherForecast(latitude, longitude) {
    const { temperatureUnit } = useConfigStore();
    return await weatherApi.get(
      `/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&format=json&temperature_unit=${temperatureUnit}`
    );
  },
};
