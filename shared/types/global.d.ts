namespace NodeJS {
  interface ProcessEnv {
    APP_BASE_URL: string;
    NUXT_ENV: "development" | "production";
    NUXT_SESSION_PASSWORD: string;
    BREVO_CONVO_ID: string;
    BREVO_API_KEY: string;
    NEWSLETTER_ID: string;
    ORG_NEWSLETTER_ID: string;
    USER_ACTION_REQUIRED_TEMPLATE_ID: string;
    INFORMATION_TEMPLATE_ID: string;
    SLACK_WEBHOOK_URL: string;
  }
}
