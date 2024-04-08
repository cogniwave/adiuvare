import { defineStore } from "pinia";

import type { Post } from "@/types/post";

interface ReportState {
  post: Post;
  dialogVisible: boolean;
  dialogRendered: boolean;
}

export const useReportStore = defineStore("report", {
  state: (): ReportState => ({
    post: {} as Post,
    dialogVisible: true,
    dialogRendered: false,
  }),
  actions: {
    toggleDialog(state: boolean) {
      if (!this.dialogRendered) {
        this.dialogRendered = true;
      }

      this.dialogVisible = state;
    },

    openDialog(post: Post) {
      this.post = post;
      this.toggleDialog(true);
    },
  },
});
