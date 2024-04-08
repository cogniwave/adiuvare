import { defineStore } from "pinia";

import type { EmptyPost, Post, PostSchedule } from "@/types/post";
import type { Errors } from "@/exceptions";

import { getPosts, addPost, getTotalPosts } from "@/services/posts.service";
import { ValidationError } from "@/exceptions";
import { useSessionStore } from "./session.store";

interface PostState {
  post: Post | EmptyPost;
  posts: Post[];
  loading: boolean;
  dialogVisible: boolean;
  dialogRendered: boolean;
  formErrors: Errors;
  totalPosts: number;
}

const DEFAULT_POST: EmptyPost = {
  title: "",
  needs: [],
  locations: [],
  description: "",
  schedule: { type: "anytime" },
};

export const usePostsStore = defineStore("posts", {
  state: (): PostState => ({
    posts: [],
    post: { ...DEFAULT_POST },
    loading: true,
    dialogVisible: true,
    dialogRendered: false,
    formErrors: {},
    totalPosts: 0,
  }),
  actions: {
    async getPosts() {
      this.loading = true;

      try {
        this.posts = await getPosts();
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    async getTotalPosts() {
      try {
        this.totalPosts = await getTotalPosts();
      } catch (err) {
        console.log(err);
      }
    },

    updatePost(prop: string, val: string | string[] | PostSchedule) {
      this.post = { ...this.post, [prop]: val };
    },

    setPost(post?: Post) {
      this.post = post || { ...DEFAULT_POST };
    },

    async createPost() {
      const $sesh = useSessionStore();

      try {
        const res = await addPost(this.post as EmptyPost, $sesh.token);

        if (res) {
          this.posts.push(res);
        }

        this.closeDialog();
      } catch (err) {
        if (err instanceof ValidationError) {
          this.formErrors = err.toError();
          return;
        }

        console.log(err);
      }
    },

    openDialog() {
      if (!this.dialogRendered) {
        this.dialogRendered = true;
      } else {
        this.setPost();
        this.dialogVisible = true;
      }
    },

    closeDialog() {
      this.dialogVisible = false;
    },
  },
});
