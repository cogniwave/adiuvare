<template>
  <v-card class="ma-2">
    <v-card-item>
      <v-card-text class="pt-0">
        <v-row no-gutters>
          <v-col cols="3" lg="2" xl="1">
            <v-avatar size="96">
              <v-img :alt="$t('posts.logoAlt')" lazy-src="/assets/images/profile-placeholder.png">
                <template #error>
                  {{ post.createdBy[0] }}
                </template>
              </v-img>
            </v-avatar>
          </v-col>

          <v-col cols="9" lg="10" xl="5">
            <section class="d-flex align-start justify-space-between mb-3">
              <h3>
                {{ post.title }}

                <span class="text-subtext-1 d-block mt-1">
                  <nuxt-link :to="`/organizations/${post.createdBy}`" @click.stop>
                    {{ post.createdBy }} - {{ $d(post.createdAt) }}
                  </nuxt-link>
                </span>
              </h3>

              <div class="d-flex flex-column">
                <app-post-need v-for="need in post.needs" :key="need" :need="need" />
              </div>
            </section>

            <p>
              {{ desc }}

              <span v-if="descTooLong && !descVisible" class="expand-desc" @click="viewAllDesc">
                {{ $t("posts.expandDesc") }}
              </span>
            </p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <app-location :locations="$props.post.locations" />

        <v-spacer />

        <v-btn variant="flat" rounded="md" :to="`/posts/${post.slug}`">
          {{ $t("posts.viewMore") }}
        </v-btn>

        <!-- post options -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="plain" color="default" size="x-small" class="ml-2" icon @click.stop.prevent>
              <v-icon size="large">fa-ellipsis-vertical</v-icon>
            </v-btn>
          </template>

          <v-list density="compact" class="px-3">
            <template v-if="post.createdBy === user">
              <!-- edit post -->
              <v-list-item
                class="pl-2 pr-2"
                prepend-icon="fa-pen-to-square"
                :title="$t('posts.options.edit')"
                @click.stop.prevent="openPost()"
              />

              <!-- enable post -->
              <v-list-item
                v-if="post.state === 'active'"
                class="pl-2 pr-2"
                prepend-icon="fa-check"
                :title="$t('posts.options.enable')"
                @click="$emit('click:state', { enable: true, title: post.title, id: post.id })"
              />

              <!-- disable post -->
              <v-list-item
                v-else
                class="pl-2 pr-2"
                prepend-icon="fa-cancel"
                :title="$t('posts.options.disable')"
                @click="$emit('click:state', { enable: false, title: post.title, id: post.id })"
              />

              <v-list-item
                class="pl-2 pr-2"
                prepend-icon="fa-trash"
                :title="$t('posts.options.delete')"
                @click="$emit('click:delete', post)"
              />
            </template>

            <template v-else>
              <v-list-item
                class="pl-2 pr-2"
                prepend-icon="fa-bullhorn"
                :title="$t('posts.options.report')"
                @click="onReport"
              />

              <v-menu v-if="post.contacts?.length && $vuetify.display.smAndUp" :close-on-content-click="false" submenu>
                <template #activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    class="pl-2 pr-2"
                    prepend-icon="fa-envelope-open-text"
                    :title="$t('posts.contacts.contact')"
                  />
                </template>

                <app-contacts-list :contacts="post.contacts" />
              </v-menu>
            </template>
          </v-list>
        </v-menu>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
  import { usePosts } from "app/store/posts";
  import AppPostNeed from "app/components/posts/AppPostNeed.vue";
  import AppLocation from "app/components/common/AppLocation.vue";
  import AppContactsList from "app/components/contacts/AppContactsList.vue";
  import type { Post, PostDeletePayload, PostStateTogglePayload } from "shared/types/post";
  import { shortenText } from "app/utils";

  const MAX_DESC = 1300;

  const $emit = defineEmits<{
    (e: "click:state", payload: PostStateTogglePayload): void;
    (e: "click:delete" | "click:report", payload: PostDeletePayload): void;
  }>();

  const $props = defineProps({
    post: { type: Object as PropType<Post>, required: true },
    user: { type: String, required: true },
  });

  const $router = useRouter();
  const { setPost } = usePosts();

  const desc = ref($props.post.description);
  const descTooLong = ref(false);
  const descVisible = ref(false);

  onBeforeMount(() => {
    if ($props.post.description.length > MAX_DESC) {
      desc.value = shortenText($props.post.description, MAX_DESC);

      descTooLong.value = true;
    }
  });

  const viewAllDesc = () => {
    desc.value = $props.post.description;
    descVisible.value = true;
  };

  const onReport = () => $emit("click:report", $props.post);

  const openPost = () => {
    setPost($props.post);
    $router.push(`posts/${$props.post.slug}/edit`);
  };
</script>

<style lang="scss" scoped>
  .text-subtext-1 {
    font-weight: normal;
    a {
      color: rgba(var(--v-theme-subtext));
    }
  }
</style>
