import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  ContactsApi,
  CreateContact,
  ContactsApiApiKeys,
  type HttpError,
} from "@getbrevo/brevo";

type Template = "userActionRequired" | "information";

interface Receiver {
  name?: string;
  email: string;
}

const TEMPLATE_NAME_TO_ID: Record<Template, number> = {
  userActionRequired: Number(process.env.USER_ACTION_REQUIRED_TEMPLATE_ID),
  information: Number(process.env.INFORMATION_TEMPLATE_ID),
};

export const sendEmail = async (subject: string, to: Receiver, template: Template, data?: Record<string, string>) => {
  const mailer = new SendSmtpEmail();

  mailer.subject = subject;
  mailer.to = [to];
  mailer.templateId = TEMPLATE_NAME_TO_ID[template];
  mailer.params = data;
  mailer.sender = {
    name: "Adiuvare",
    email: "noreply@adiuvare.pt",
  };

  const api = new TransactionalEmailsApi();
  api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

  try {
    return await api.sendTransacEmail(mailer);
  } catch (error) {
    console.log((error as HttpError).body);
    throw error;
  }
};

// export type NewsletterType = "newsletter" | "orgNewsletter";

// const NEWSLETTER_TO_ID: Record<NewsletterType, number> = {
//   newsletter: Number(process.env.NEWSLETTER_ID),
//   orgNewsletter: Number(process.env.ORG_NEWSLETTER_ID),
// };

export const subscribeToNewsletter = async (email: string) => {
  const contact = new CreateContact();
  const api = new ContactsApi();

  contact.email = email;
  contact.listIds = [Number(process.env.NEWSLETTER_ID)];

  api.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

  try {
    await api.createContact(contact);
  } catch (error) {
    if ((error as HttpError).body.code === "duplicate_parameter") {
      return;
    }

    throw error;
  }
};
