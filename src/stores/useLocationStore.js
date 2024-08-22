import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { Cookies } from "quasar";

export const useLocationStore = defineStore("location", {
  state: () => {
    const { t } = useI18n();
    return {
      locationSelected: {
        name: "",
        latLong: "",
      },
      topLocations: [
        { name: t("newYork"), latLong: "40.7128,-74.0060" },
        { name: t("tokyo"), latLong: "35.6895,139.6917" },
        { name: t("london"), latLong: "51.5074,-0.1278" },
        { name: t("paris"), latLong: "48.8566,2.3522" },
        { name: t("shanghai"), latLong: "31.2304,121.4737" },
        { name: t("mumbai"), latLong: "19.0760,72.8777" },
        { name: t("saoPaulo"), latLong: "-23.5505,-46.6333" },
        { name: t("moscow"), latLong: "55.7558,37.6173" },
        { name: t("losAngeles"), latLong: "34.0522,-118.2437" },
        { name: t("beijing"), latLong: "39.9042,116.4074" },
      ],
      locationsSelectedList: Cookies.has("favoriteLocations")
        ? Cookies.get("favoriteLocations")
        : [],
      locationsFavoriteList: Cookies.has("favoriteLocations")
        ? Cookies.get("favoriteLocations")
        : [],
    };
  },
  getters: {},
  actions: {
    selectLocation(locationSelected) {
      this.locationSelected = locationSelected;
      this.locationsSelectedList.push(locationSelected);
    },
    selectFavoriteLocation(locationSelected) {
      this.locationsFavoriteList.push(locationSelected);
    },
    removeLocationFromList(locationName, latLong) {
      this.locationsSelectedList = this.locationsSelectedList.filter(
        (x) => x.name != locationName && x.latLong != latLong
      );
    },
    removeFavoriteLocationFromList(locationName, latLong) {
      this.locationsFavoriteList = this.locationsFavoriteList.filter(
        (x) => x.name != locationName && x.latLong != latLong
      );
    },
  },
});
