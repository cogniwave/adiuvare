import "@fortawesome/fontawesome-free/css/all.css"; // Ensure your project is capable of handling css files
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import { blueGrey } from "vuetify/util/colors";
import pt from "dayjs/locale/pt";
import DayjsAdapter from "@date-io/dayjs";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(
    createVuetify({
      date: {
        adapter: DayjsAdapter,
        locale: { pt },
      },
      theme: {
        themes: {
          light: {
            colors: {
              primary: blueGrey.base,
              surface: blueGrey.darken4,
              background: blueGrey.lighten5,
            },
          },
        },
        defaultTheme: "light",
      },
      defaults: {
        VCard: {
          color: blueGrey.lighten5,
        },
        VIcon: {
          size: "x-small",
        },
      },
      ssr: true,
      icons: {
        defaultSet: "fa",
        aliases,
        sets: { fa },
      },
    }),
  );
});
