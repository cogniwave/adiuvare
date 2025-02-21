<template>
  <template v-if="pending">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-else-if="currPost && Object.keys(currPost)">
    <div class="d-flex mb-1">
      <v-btn variant="text" @click="$router.go(-1)">
        <v-icon>fa-solid fa-chevron-left</v-icon>
        {{ t("posts.back") }}
      </v-btn>

      <v-btn
        v-if="canEdit"
        variant="text"
        size="small"
        rounded="md"
        class="ml-auto"
        :to="`/posts/${currPost.slug}/edit`"
      >
        <v-icon class="mr-1">fa-solid fa-pencil</v-icon>
        {{ t("form.edit") }}
      </v-btn>
    </div>

    <div class="bg-white rounded pa-5">
      <div class="d-flex">
        <v-avatar size="64">
          <v-img :alt="t('posts.logoAlt')" lazy-src="/assets/images/profile-placeholder.png">
            <template #error>
              {{ currPost.createdBy }}
            </template>
          </v-img>
        </v-avatar>

        <div class="ml-2">
          <h2>{{ currPost.title }}</h2>

          <nuxt-link class="text-subtitle mr-1" :to="`/users/${currPost.createdBy}`">
            {{ currPost.createdBy }}
          </nuxt-link>

          <template v-if="currPost.updatedAt && currPost.createdAt">
            <v-tooltip
              v-if="currPost.updatedAt"
              location="bottom"
              close-on-content-click
              close-delay="0"
              :text="`${t('posts.lastUpdatedAt')} ${d(currPost.updatedAt as any)}`"
            >
              <template #activator="{ props }">
                <small v-bind="props">¬ {{ d(currPost.createdAt as any) }}</small>
              </template>
            </v-tooltip>

            <small v-else>¬ {{ d(currPost.createdAt as any) }}</small>
          </template>
        </div>
      </div>

      <v-row no-gutters class="mb-5 mt-2">
        <v-col cols="12" md="6" order="2">
          <v-chip
            v-for="location in currPost.locations"
            :key="location"
            color="primary"
            label
            class="pl-2 pr-2 cursor-pointer mr-1"
            rounded="md"
            size="small"
          >
            {{ location }}
          </v-chip>
        </v-col>

        <v-col cols="12" md="6" order="1" :align="mdAndDown ? 'start' : 'end'" :class="{ 'mb-2': mdAndDown }">
          <ad-post-need v-for="need in currPost.needs" :key="need" :need="need" size="small" variant="flat" />
        </v-col>
      </v-row>

      <code>{{ currPost.description }}</code>
    </div>

    <div v-if="currPost.schedule" class="bg-white rounded px-10 py-5 mt-5">
      <!-- contacts -->
      {{ t("posts.contacts.detailsTitle") }}

      <ad-contacts-list v-if="currPost.contacts?.length" :contacts="currPost.contacts" bg-color="transparent" />

      <!-- anytime time -->
      <div class="my-3">
        {{ t("posts.schedule.detailsTitle") }}
      </div>

      <v-row v-if="currPost.schedule.type === 'anytime'">
        <v-col align="center">
          <span>{{ t("posts.schedule.anytime") }}</span>
        </v-col>
      </v-row>

      <!-- specific -->
      <v-row v-if="currPost.schedule.type === 'specific'">
        <v-col align="center" cols="6">
          <span>{{ formatSpecificDay() }}</span>
        </v-col>

        <v-col align="center" cols="6">
          <span v-for="time in (currPost.schedule.payload as SpecificSchedule).times" :key="time.id" class="d-block">
            {{ t("posts.schedule.from") }}
            {{ time.start }}
            {{ t("posts.schedule.to") }}
            {{ time.end }}
          </span>
        </v-col>
      </v-row>

      <!-- recurring -->
      <template v-if="currPost.schedule.type === 'recurring'">
        <v-row>
          <v-col v-for="time in recurringTimes" :key="time.day" align="center">
            {{ time.day }}
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="time in recurringTimes" :key="time.day" align="center">
            <p v-for="tim in time.times" :key="tim.id" class="mb-2">{{ tim.start }} - {{ tim.end }}</p>
          </v-col>
        </v-row>
      </template>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router";
  import { useDisplay } from "vuetify";

  import { useAuth } from "@/store/auth";
  import { usePosts } from "@/store/posts";
  import dayjs from "@/services/dayjs.service";
  import type { Post, RecurringSchedule, ScheduleTime, SpecificSchedule } from "@/types/post";

  definePageMeta({ path: "/posts/:slug", title: "pages.postDetails" });

  interface MappedRecurringTimes {
    times: ScheduleTime[];
    order: number;
    day: string;
  }

  const { currPost, setPost } = usePosts<Post>();
  const $router = useRouter();
  const $route = useRoute();
  const { data: user } = useAuth();
  const { d, t } = useI18n();
  const { mdAndDown } = useDisplay();

  const WEEK_DAY_TO_HUMAN = [
    t("form.post.schedule.day.sunday"),
    t("form.post.schedule.day.monday"),
    t("form.post.schedule.day.tuesday"),
    t("form.post.schedule.day.wednesday"),
    t("form.post.schedule.day.thursday"),
    t("form.post.schedule.day.friday"),
    t("form.post.schedule.day.saturday"),
  ];

  const DAY_TO_I18N: Record<string, { day: string; order: number }> = {
    monday: {
      day: t("form.post.schedule.day.sunday"),
      order: 0,
    },
    tuesday: {
      day: t("form.post.schedule.day.monday"),
      order: 1,
    },
    wednesday: {
      day: t("form.post.schedule.day.tuesday"),
      order: 2,
    },
    thursday: {
      day: t("form.post.schedule.day.wednesday"),
      order: 3,
    },
    friday: {
      day: t("form.post.schedule.day.thursday"),
      order: 4,
    },
    saturday: {
      day: t("form.post.schedule.day.friday"),
      order: 5,
    },
    sunday: {
      day: t("form.post.schedule.day.saturday"),
      order: 6,
    },
  };

  const slug = $route.params.slug as string;

  const {
    data: post,
    pending,
    error,
  } = await useFetch<Post>(`/api/v1/posts/${slug}`, {
    lazy: true,
    onResponse({ response }) {
      setPost(response._data);
    },
  });

  const recurringTimes = computed<MappedRecurringTimes[]>(() => {
    if (currPost.value.schedule.type !== "recurring") {
      return [];
    }

    return Object.entries(currPost.value.schedule.payload as RecurringSchedule)
      .reduce<MappedRecurringTimes[]>((result, [day, times]) => {
        result.push({
          ...DAY_TO_I18N[day]!,
          times: times!.toSorted((a, b) => a.start.localeCompare(b.start)),
        });

        return result;
      }, [])
      .toSorted((a, b) => b.order - a.order);
  });

  const canEdit = computed(() => post.value?.createdBy === user.value?.slug);

  const formatSpecificDay = () => {
    const day = (currPost.value.schedule.payload as SpecificSchedule).day;

    return `${WEEK_DAY_TO_HUMAN[dayjs(day).day()]} - ${d(day)}`;
  };

  watch(
    () => error.value,
    (err) => {
      if (!err) {
        return;
      }

      throw createError(err);
    },
    { immediate: true },
  );
</script>

<style lang="scss" scoped>
  a {
    color: initial;
  }

  span {
    font-weight: initial;
    font-size: initial;
    line-height: initial;
  }
</style>
