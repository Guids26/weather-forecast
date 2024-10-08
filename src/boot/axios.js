import { boot } from "quasar/wrappers";
import axios from "axios";

const geolocationApi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
});
const weatherApi = axios.create({ baseURL: "https://api.open-meteo.com/v1" });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$geolocationApi = geolocationApi;
  app.config.globalProperties.$weatherApi = weatherApi;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { geolocationApi, weatherApi };
