import "material-design-icons-iconfont/dist/material-design-icons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, md } from "vuetify/iconsets/md";
import pt from "dayjs/locale/pt";
import DayjsAdapter from "@date-io/dayjs";

export default defineNuxtPlugin((app) => {
  app.vueApp.use(
    createVuetify({
      date: {
        adapter: DayjsAdapter,
        locale: { pt },
      },
      ssr: true,
      icons: {
        defaultSet: "md",
        aliases,
        sets: { md },
      },
    }),
  );
});
