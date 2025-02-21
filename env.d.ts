export {};

declare global {
  interface Window {
    BrevoConversationsID?: string;
    // eslint-disable-next-line
    BrevoConversations?: any;
    // https://developers.brevo.com/docs/javascript-api-reference
    BrevoConversationsSetup?: {
      deferredLoading: boolean;
    };
  }
}
