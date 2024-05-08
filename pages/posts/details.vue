<template>
  <template v-if="pending">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-if="currPost && Object.keys(currPost)">
    <div class="d-flex justify-end mb-1">
      <v-btn
        v-if="canEdit"
        variant="text"
        size="small"
        rounded="md"
        :to="`/posts/${currPost.slug}/edit`"
      >
        <v-icon class="mr-1">fa-solid fa-pencil</v-icon>
        {{ $t("form.edit") }}
      </v-btn>
    </div>

    <div class="bg-white rounded pa-5">
      <div class="d-flex">
        <v-avatar size="64">
          <v-img :alt="$t('posts.logoAlt')" lazy-src="/assets/post-profile-placeholder.png">
            <template v-slot:error>
              {{ currPost.createdBy }}
            </template>
          </v-img>
        </v-avatar>

        <div class="ml-2">
          <h2>{{ currPost.title }}</h2>

          <nuxt-link class="text-subtitle mr-1" :to="`/profile/${currPost.createdBy}`">
            {{ currPost.createdBy }}
          </nuxt-link>

          <v-tooltip
            v-if="currPost.updatedAt"
            location="bottom"
            close-on-content-click
            close-delay="0"
            :text="`${$t('posts.lastUpdatedAt')} ${$d(new Date(currPost.updatedAt))}`"
          >
            <template v-slot:activator="{ props }">
              <small v-bind="props">¬ {{ $d(new Date(currPost.createdAt)) }}</small>
            </template>
          </v-tooltip>

          <small v-else>¬ {{ $d(new Date(currPost.createdAt)) }}</small>
        </div>
      </div>

      <v-row no-gutters class="mb-5 mt-2">
        <v-col cols="6">
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

        <v-col cols="6" align="end">
          <qa-post-need
            v-for="need in currPost.needs"
            :key="need"
            :need="need"
            size="small"
            variant="flat"
          />
        </v-col>
      </v-row>

      <code v-html="currPost.description" />
    </div>

    <!-- anytime time -->
    <template v-if="currPost.schedule">
      <div v-if="currPost.schedule.type === 'anytime'" class="bg-white rounded px-10 py-5 mt-5">
        <v-row>
          <v-col align="center">
            <span>{{ $t("posts.schedule.anytime") }}</span>
          </v-col>
        </v-row>
      </div>

      <!-- specific -->
      <div v-if="currPost.schedule.type === 'specific'" class="bg-white rounded px-10 py-5 mt-5">
        <v-row>
          <v-col align="center" cols="6">
            <span>{{ formatSpecificDay() }}</span>
          </v-col>

          <v-col align="center" cols="6">
            <span
              v-for="time in (currPost.schedule.payload as SpecificSchedule).times"
              :key="time.id"
              class="d-block"
            >
              {{ $t("posts.schedule.from") }}
              {{ time.start }}
              {{ $t("posts.schedule.to") }}
              {{ time.end }}
            </span>
          </v-col>
        </v-row>
      </div>

      <!-- recurring -->
      <div v-if="currPost.schedule.type === 'recurring'" class="bg-white rounded px-10 py-5 mt-10">
        <v-row>
          <v-col v-for="time in recurringTimes" :key="time.day" align="center">{{
            time.day
          }}</v-col>
        </v-row>

        <v-row>
          <v-col v-for="time in recurringTimes" :key="time.day" align="center">
            <p v-for="t in time.times" :key="t.id" class="mb-2">{{ t.start }} - {{ t.end }}</p>
          </v-col>
        </v-row>
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";

import dayjs from "@/services/dayjs.service";
import type { Post, RecurringSchedule, ScheduleTime, SpecificSchedule } from "@/types/post";

definePageMeta({ path: "/posts/:slug" });

interface MappedRecurringTimes {
  times: ScheduleTime[];
  order: number;
  day: string;
}

const { currPost, setPost } = usePosts<Post>();
const $router = useRouter();
const $route = useRoute();
const { data: user } = useAuth();
const { notifyError } = useNotify();
const { d, t } = useI18n();

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
  execute,
} = useFetch<Post>(`/api/v1/posts/${slug}`, { lazy: true, immediate: false });

onBeforeMount(() => {
  if (slug !== currPost.value.slug) {
    setPost(null);
  }

  execute();
});

const recurringTimes = computed<MappedRecurringTimes[]>(() => {
  if (currPost.value.schedule.type !== "recurring") {
    return [];
  }

  return Object.entries(currPost.value.schedule.payload as RecurringSchedule)
    .reduce<MappedRecurringTimes[]>((result, [day, times]) => {
      result.push({
        ...DAY_TO_I18N[day],
        times: (times as ScheduleTime[]).toSorted((a, b) => a.start.localeCompare(b.start)),
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
  () => post.value,
  (post) => post && (currPost.value = post),
  { immediate: true },
);

watch(
  () => error.value,
  (err) => {
    if (!err) {
      return;
    }

    if (err.statusCode === 404) {
      $router.push("/not-found");
    } else {
      notifyError(t("errors.fetchPost"));
      $router.push("/");
    }
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
