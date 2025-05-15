import {createRouter, createWebHistory} from "vue-router";
const AlertsComponent = () => import('/src/alerts-and-notifications/pages/alert-dashboard.component.vue');

const routes = [
    {
        path: '/alerts', name: 'alerts', component: AlertsComponent, meta: { title: 'Alerts' }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;