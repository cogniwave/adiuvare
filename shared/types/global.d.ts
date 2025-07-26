namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    BASE_ASSET_URL: string;
    NODE_ENV: "development" | "preview" | "production";
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
