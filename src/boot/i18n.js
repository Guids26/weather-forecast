import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import { Cookies } from "quasar";

const userLocale = navigator.language || "en-US"; // Padrão para 'en-US' se o idioma não estiver disponível no navegador

export default boot(({ app }) => {
  const i18n = createI18n({
    allowComposition: true, // to use with Composition API
    globalInjection: true, // to inject in the component
    locale: Cookies.has("locale") ? Cookies.get("locale") : userLocale,
    fallbackLocale: "en-US",
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
  return {
    i18n,
  };
});
