import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

type Template = "userActionRequired" | "information";

interface Receiver {
  name: string;
  email: string;
}

const brevo = new TransactionalEmailsApi();

brevo.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);

const TEMPLATE_NAME_TO_ID: Record<Template, number> = {
  userActionRequired: 1,
  information: 6,
};

export const sendEmail = (
  subject: string,
  to: Receiver,
  template: Template,
  data?: Record<string, string>,
) => {
  const mailer = new SendSmtpEmail();

  mailer.subject = subject;
  mailer.to = [to];
  mailer.templateId = TEMPLATE_NAME_TO_ID[template];
  mailer.params = data;

  return brevo.sendTransacEmail(mailer);
};
