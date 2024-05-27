import type { Report } from "@/types/report";
import type { NotifyPost } from "@/types/post";
import type { User } from "@/types/user";

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
