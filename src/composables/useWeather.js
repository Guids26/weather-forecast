import weather from "src/api/weather/weather";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export function useWeather() {
  const { t } = useI18n();
  const loading = ref(false);
  const error = ref(null);
  const searchCurrentMinAndMaxTemperature = async (latitude, longitude) => {
    loading.value = true;
    let data = null;
    try {
      const response = await weather.searchCurrentMinAndMaxTemperature(
        latitude,
        longitude
      );
      //data = response.data;

      data = {
        maxTemperature: response.data.daily.temperature_2m_max[0],
        minTemperature: response.data.daily.temperature_2m_min[0],
      };
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
      return data;
    }
  };

  const searchWeatherForecast = async (latitude, longitude) => {
    loading.value = true;
    let data = null;
    try {
      const response = await weather.searchCompleteWeatherForecast(
        latitude,
        longitude
      );

      data = {
        maxTemperature: response.data.daily.temperature_2m_max[0],
        minTemperature: response.data.daily.temperature_2m_min[0],
        temperature: response.data.current.temperature_2m,
        aparentTemperature: response.data.current.apparent_temperature,
        humidity: response.data.current.relative_humidity_2m,
        weatherCode: response.data.current.weather_code,
        wind: response.data.current.wind_speed_10m,
        maxTemperatureNextSevenDays:
          response.data.daily.temperature_2m_max || [],
        minTemperatureNextSevenDays:
          response.data.daily.temperature_2m_min || [],
        humidityUnit: response.data.current_units.relative_humidity_2m,
        windUnit: response.data.current_units.wind_speed_10m,
      };

      data.forecastInNextDays = response.data.daily.temperature_2m_max.map(
        (maxTemp, index) => ({
          maxTemperature: maxTemp,
          minTemperature: response.data.daily.temperature_2m_min[index],
          date: response.data.daily.time[index],
        })
      );
      console.log(data);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
      return data;
    }
  };

  const getWeatherIcon = (code) => {
    let iconName;

    switch (code) {
      case 0:
        iconName = "wb_sunny"; // Clear sky
        break;
      case 1:
      case 2:
      case 3:
        iconName = "cloud"; // Mainly clear, partly cloudy, overcast
        break;
      case 45:
      case 48:
        iconName = "waves"; // Fog and depositing rime fog
        break;
      case 51:
      case 53:
      case 55:
        iconName = "invert_colors"; // Drizzle: Light, moderate, and dense intensity
        break;
      case 56:
      case 57:
        iconName = "ac_unit"; // Freezing Drizzle: Light and dense intensity
        break;
      case 61:
      case 63:
      case 65:
        iconName = "umbrella"; // Rain: Slight, moderate, and heavy intensity
        break;
      case 66:
      case 67:
        iconName = "ac_unit"; // Freezing Rain: Light and heavy intensity
        break;
      case 71:
      case 73:
      case 75:
        iconName = "ac_unit"; // Snow fall: Slight, moderate, and heavy intensity
        break;
      case 77:
        iconName = "ac_unit"; // Snow grains
        break;
      case 80:
      case 81:
      case 82:
        iconName = "umbrella"; // Rain showers: Slight, moderate, and violent
        break;
      case 85:
      case 86:
        iconName = "ac_unit"; // Snow showers: Slight and heavy
        break;
      case 95:
        iconName = "flash_on"; // Thunderstorm: Slight or moderate
        break;
      case 96:
      case 99:
        iconName = "flash_on"; // Thunderstorm with slight and heavy hail
        break;
      default:
        iconName = "help"; // Default icon for unknown codes
        break;
    }

    return iconName;
  };

  const getWeatherDescription = (code) => {
    let description;

    switch (code) {
      case 0:
        description = t("clearSky");
        break;
      case 1:
      case 2:
      case 3:
        description = t("mainlyClearPartlyCloudyOrOvercast");
        break;
      case 45:
      case 48:
        description = t("fogOrDepositingRimeFog");
        break;
      case 51:
      case 53:
      case 55:
        description = t("drizzleLightModerateOrDenseIntensity");
        break;
      case 56:
      case 57:
        description = t("freezingDrizzleLightOrDenseIntensity");
        break;
      case 61:
      case 63:
      case 65:
        description = t("rainSlightModerateOrHeavyIntensity");
        break;
      case 66:
      case 67:
        description = t("freezingRainLightOrHeavyIntensity");
        break;
      case 71:
      case 73:
      case 75:
        description = t("snowfallSlightModerateOrHeavyIntensity");
        break;
      case 77:
        description = t("snowGrains");
        break;
      case 80:
      case 81:
      case 82:
        description = t("rainShowersSlightModerateOrViolent");
        break;
      case 85:
      case 86:
        description = t("snowShowersSlightOrHeavy");
        break;
      case 95:
        description = t("thunderstormSlightOrModerate");
        break;
      case 96:
      case 99:
        description = t("thunderstormWithSlightOrHeavyHail");
        break;
      default:
        description = t("unknownWeatherCondition");
        break;
    }

    return description;
  };

  return {
    searchCurrentMinAndMaxTemperature,
    searchWeatherForecast,
    getWeatherIcon,
    getWeatherDescription,
    loading,
    error,
  };
}
