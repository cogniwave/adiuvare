import { defineStore } from "pinia";

import type {
  EmptyPost,
  Post,
  PostDeletePayload,
  PostSchedule,
  PostStateTogglePayload,
} from "@/types/post";
import type { Errors } from "@/exceptions";

import {
  getPosts,
  addPost,
  getTotalPosts,
  disablePost,
  deletePost,
  getPostBySlug,
} from "@/services/posts.service";
import { ValidationError } from "@/exceptions";

interface PostState {
  post: Post | EmptyPost | PostDeletePayload | PostStateTogglePayload;
  posts: Post[];
  loading: boolean;
  dialogVisible: boolean;
  dialogRendered: boolean;
  formErrors: Errors;
  totalPosts: number;

  disableDialogVisible: boolean;

  deleteDialogVisible: boolean;
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
    // @ts-expect-error starts as null but cba to type like as nullable because then will
    // always need to null check and its unnecessary
    post: null,
    loading: true,
    dialogVisible: true,
    dialogRendered: false,
    formErrors: {},
    totalPosts: 0,
    disableDialogVisible: true,
    deleteDialogVisible: true,
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

    setPost(post?: Post | PostDeletePayload | PostStateTogglePayload) {
      this.post = post || { ...DEFAULT_POST };
    },

    async createPost() {
      try {
        const res = await addPost(this.post as EmptyPost);

        if (res) {
          this.posts.push(res);
        }

        this.closeDialog();
      } catch (err) {
        if (err instanceof ValidationError) {
          this.formErrors = err.toError();
          return;
        }

        throw err;
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

    async disablePost(id: string) {
      await disablePost(id);

      this.posts = this.posts.filter((p) => p.id !== id);
    },

    toggleDisableDialog(payload: boolean) {
      this.disableDialogVisible = payload;
    },

    toggleDeleteDialog(payload: boolean) {
      this.deleteDialogVisible = payload;
    },

    async deletePost(id: string) {
      await deletePost(id);

      this.posts = this.posts.filter((p) => p.id !== id);
    },

    async getPostBySlug(slug: string) {
      this.loading = true;

      try {
        this.post = await getPostBySlug(slug);
      } finally {
        this.loading = false;
      }
    },
  },
});
