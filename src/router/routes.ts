import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/auth/pages/RegisterPage.vue') }],
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/auth/pages/LoginPage.vue') }],
  },

  {
    path: '/user/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/users/pages/UserPage.vue') }],
  },

  {
    path: '/users',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/users/pages/UsersPage.vue') }],
  },

  {
    path: '/roles',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/roles/pages/RolesPage.vue') }],
  },

  {
    path: '/role/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/roles/pages/RolePage.vue') }],
  },

  {
    path: '/projects',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/projects/pages/ProjectsPage.vue') }],
  },

  {
    path: '/project/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/modules/projects/pages/ProjectPage.vue') }],
  },

  {
    path: '/tasks',
    alias: ['/boards', '/articles', '/groups', '/organizations'],
    component: () => import('pages/InDevelopment.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
