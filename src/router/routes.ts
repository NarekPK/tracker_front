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
    children: [{ path: '', name: 'register', component: () => import('src/modules/auth/pages/RegisterPage.vue') }],
  },

  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'login', component: () => import('src/modules/auth/pages/LoginPage.vue') }],
  },

  {
    path: '/user/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'user', component: () => import('src/modules/users/pages/UserPage.vue') }],
  },

  {
    path: '/users',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'users', component: () => import('src/modules/users/pages/UsersPage.vue') }],
  },

  {
    path: '/roles',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'roles', component: () => import('src/modules/roles/pages/RolesPage.vue') }],
  },

  {
    path: '/role/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'role', component: () => import('src/modules/roles/pages/RolePage.vue') }],
  },

  {
    path: '/projects',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'projects', component: () => import('src/modules/projects/pages/ProjectsPage.vue') }],
  },

  {
    path: '/project/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'project', component: () => import('src/modules/projects/pages/ProjectPage.vue') }],
  },

  {
    path: '/issues',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'issues', component: () => import('src/modules/issues/pages/IssuesPage.vue') }],
  },

  {
    path: '/create-issue',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'create-issue', component: () => import('src/modules/issues/pages/CreateIssuePage.vue') }],
  },

  {
    path: '/issue/:id',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', name: 'issue', component: () => import('src/modules/issues/pages/IssuePage.vue') }],
  },

  {
    path: '/boards',
    alias: ['/articles', '/groups', '/organizations'],
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
