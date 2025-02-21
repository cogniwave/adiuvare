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
              primary: blueGrey.base, // #607D8B
              accent: blueGrey.darken4, // #263238
              surface: "#f7f7f7",
              background: blueGrey.lighten5, // #ECEFF1
              text: blueGrey.darken4, // #263238
            },
          },
        },
        defaultTheme: "light",
      },
      defaults: {
        VCard: {
          variant: "outlined",
          class: "post",
          rounded: "xl",
          color: blueGrey.darken4,
          background: "#f7f7f7",
        },
        VIcon: {
          size: "x-small",
        },
        VTextField: {
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          validateOn: "blur",
          variant: "underlined",
        },
        VTextarea: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
        },
        VAutocomplete: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          autoGrow: true,
          autoSelectFirst: true,
        },
        VSelect: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          hideHint: true,
        },
        VTooltip: {
          location: "top",
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
