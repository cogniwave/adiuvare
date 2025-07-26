import { translate } from "server/utils/i18n";

type Template = "userActionRequired" | "information";

interface Receiver {
  name?: string;
  email: string;
}

const TEMPLATE_NAME_TO_ID: Record<Template, number> = {
  userActionRequired: Number(import.meta.env.USER_ACTION_REQUIRED_TEMPLATE_ID),
  information: Number(import.meta.env.INFORMATION_TEMPLATE_ID),
};

export const sendEmail = async (subject: string, to: Receiver, template: Template, data?: Record<string, string>) => {
  const payload = {
    sender: {
      name: "Adiuvare",
      email: "noreply@adiuvare.pt",
    },
    to: [
      {
        email: to.email,
        name: to.name || "",
      },
    ],
    subject: translate(subject),
    textContent: translate("emails.body.text"),
    templateId: TEMPLATE_NAME_TO_ID[template],
    params: {
      ...data,
      footer: {
        privacyLink: translate("emails.footer.privacyLink"),
        cancelSub: translate("emails.footer.cancelSub"),
      },
    },
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": import.meta.env.BREVO_TOKEN as string,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error(errorBody);
      throw new Error(response.statusText);
    }
    const a = await response.json();
    return a;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export type NewsletterType = "newsletter" | "orgNewsletter";

// const NEWSLETTER_TO_ID: Record<NewsletterType, number> = {
//   newsletter: Number(import.meta.env.NEWSLETTER_ID),
//   orgNewsletter: Number(import.meta.env.ORG_NEWSLETTER_ID),
// };

export const subscribeToNewsletter = async (_email: string) => {
  return;
  // const contact = new CreateContact();
  // const api = new ContactsApi();

  // contact.email = email;
  // contact.listIds = [Number(import.meta.env.NEWSLETTER_ID)];

  // api.setApiKey(ContactsApiApiKeys.apiKey, import.meta.env.BREVO_API_KEY!);

  // try {
  //   await api.createContact(contact);
  // } catch (error) {
  //   if ((error as HttpError).body.code === "duplicate_parameter") {
  //     return;
  //   }

  //   throw error;
  // }
};
