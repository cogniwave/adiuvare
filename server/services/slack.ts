import type { Report } from "shared/types/report";
import type { NotifyPost } from "shared/types/post";
import type { User } from "shared/types/user";

const sendToSlack = async (message: string) => {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("SLACK_WEBOOK NOT DEFINED");
      useBugsnag().notify("SLACK_WEBOOK NOT DEFINED");
    }

    return;
  }

  try {
    await fetch(webhook, {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({ text: message }),
    });

    console.log(`[slack]: ${message}`);
  } catch (err) {
    console.log(`"[slack] failed to send message: ${err}`);
    useBugsnag().notify({
      name: "[slack] couldnt post to slack user",
      message: JSON.stringify({ err, message }),
    });
  }
};

export const notifyNewReport = async (report: Report) => {
  return await sendToSlack(
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

export const notifyNewUser = async (user: User) => {
  return await sendToSlack(
    `:standing_person: New user created 
      - id: ${user.id}
      - name: ${user.name}
      - email: ${user.email}
      - type: ${user.type}
    `,
  );
};

export const notifyNewPost = async (post: NotifyPost) => {
  return await sendToSlack(
    `:scroll: New post created 
      - id: ${post.id}
      - created by: ${post.createdBy}
      - title: ${post.title}
    `,
  );
};
