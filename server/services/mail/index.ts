import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

type Template = "userActionRequired" | "information";

interface Receiver {
  name?: string;
  email: string;
}

const brevo = new TransactionalEmailsApi();

brevo.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);

const TEMPLATE_NAME_TO_ID: Record<Template, number> = {
  userActionRequired: 1,
  information: 6,
};

export const sendEmail = async (
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

  try {
    await brevo.sendTransacEmail(mailer);
    console.log(`[email]: email sent for template ${template}`);
    return;
  } catch (err) {
    console.log(`"[email] failed to send email: ${err}`);
    useBugsnag().notify({
      name: "[email] failed to send email couldnt post to slack user",
      message: JSON.stringify({ err, to: to.email, data, subject }),
    });
  }
};
