import type { Report } from "@/types/report";
import type { NotifyPost } from "@/types/post";
import type { User } from "@/types/user";

const sendToSlack = (message: string) => {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  console.log(webhook);

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("SLACK_WEBOOK NOT DEFINED");
      useBugsnag().notify("SLACK_WEBOOK NOT DEFINED");
    }

    return;
  }

  fetch(webhook, {
    headers: { "Content-type": "application/json" },
    method: "POST",
    body: JSON.stringify({ text: message }),
  })
    .then(() => console.log(`[slack]: ${message}`))
    .catch((err) => {
      console.log(`"[slack] failed to send message: ${err}`);
      useBugsnag().notify({
        name: "[slack] couldnt post to slack user",
        message: JSON.stringify({ err, message }),
      });
    });
};

export const notifyNewReport = (report: Report) => {
  sendToSlack(
    `:mega: New report created 
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

export const notifyNewUser = (user: User) => {
  sendToSlack(
    `:standing_person: New user created 
      - id: ${user.id}
      - name: ${user.name}
      - email: ${user.email}
      - type: ${user.type}
    `,
  );
};

export const notifyNewPost = (post: NotifyPost) => {
  sendToSlack(
    `:scroll: New post created 
      - id: ${post.id}
      - created by: ${post.createdBy}
      - title: ${post.title}
    `,
  );
};
