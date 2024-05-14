import type { Report } from "@/types/report";

const sendToSlack = (message: string) => {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      useBugsnag().notify("SLACK_WEBOOK NOT DEFINED");
    }

    return console.log(`[slack]: ${message}`);
  }

  $fetch(webhook, {
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: { text: message },
  });
};

export const notifyNewReport = (report: Report) => {
  sendToSlack(
    `New report created 
      user: ${report.user}
      reason: ${report.reason}
      post: 
        - id: ${report.post.id}
        - created by: ${report.post.createdBy}
        - title: ${report.post.title}
        - description: ${report.post.description}
    `,
  );
};
