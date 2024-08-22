import { defineStore } from "pinia";
import { Cookies } from "quasar";

export const useConfigStore = defineStore("config", {
  state: () => ({
    temperatureUnit: Cookies.has("temperatureUnit")
      ? Cookies.get("temperatureUnit")
      : "celsius", // "celsius" or "fahrenheit",
  }),
  getters: {},
  actions: {
    updateTemperatureUnit(unit) {
      this.temperatureUnit = unit;
    },
  },
});
