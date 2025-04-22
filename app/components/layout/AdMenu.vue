<template>
  <v-list bg-color="transparent" class="menu-list">
    <template v-if="loggedIn">
      <v-list-item :title="t('posts.submit')" to="/posts/new" prepend-icon="fa-solid fa-house"
                   active-class="active-menu-item" />
      <v-divider class="my-3" />
    </template>

    <v-list-item :title="t('menu.home')" to="/" prepend-icon="fa-solid fa-house" active-class="active-menu-item" />

    <v-list-item :title="t('menu.orgs')" to="/organizations" prepend-icon="fa-solid fa-building-ngo"
                 active-class="active-menu-item" />
    <!-- <v-list-item
            v-if="showUserPosts"
            prepend-icon="fa-solid fa-file-lines"
            :title="t('menu.posts')"
            :to="{ path: '/', query: { createdBy: $route.params.slug } }"
          /> -->

    <template v-if="!loggedIn">
      <v-list-item :title="t('login.title')" to="/login" prepend-icon="fa-solid fa-arrow-right-to-bracket"
                   active-class="active-menu-item" />
      <v-list-item :title="t('register.title')" to="/register" prepend-icon="fa-solid fa-user-plus"
                   active-class="active-menu-item" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const { loggedIn } = useUserSession();
</script>

