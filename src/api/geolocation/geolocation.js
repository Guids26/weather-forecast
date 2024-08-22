import { geolocationApi } from "src/boot/axios";
import { Cookies } from "quasar";

export default {
  search(locationName) {
    const language = !Cookies.has("locale")
      ? "pt"
      : Cookies.get("locale") == "pt-BR"
      ? "pt"
      : "en";
    return geolocationApi.get(
      `/search?name=${locationName}&language=${language}&format=json`
    );
  },
};
