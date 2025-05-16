import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '../authentication/pages/login.component.vue';
import RegisterComponent from '../authentication/pages/register.component.vue';
import PasswordRecoveryComponent from '../authentication/pages/password-recovery.component.vue';
import ConfirmationCodeComponent from '../authentication/pages/confirmation-code.component.vue';
import ProfileComponent from '../profile-management/pages/profile.component.vue';
import DashboardComponent from '../analytics-and-reporting/pages/dashboard.component.vue';
import AlertComponent from '../alerts-and-notifications/pages/alert-dashboard.component.vue';
import ReportsComponent from '../analytics-and-reporting/pages/report-management.component.vue';
import ReportCreateAndEdit from '../analytics-and-reporting/pages/report-create-and-edit.component.vue';
import ProductCreateAndEditComponent from "@/inventory-management/pages/product-create-and-edit.component.vue";
import InventoryComponent from "@/inventory-management/pages/inventory.component.vue";

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterComponent
    },
    {
        path: '/password-recovery',
        name: 'PasswordRecovery',
        component: PasswordRecoveryComponent
    },
    {
        path: '/confirmation-code',
        name: 'ConfirmationCode',
        component: ConfirmationCodeComponent
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileComponent
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent
    },
    {
        path: '/alerts',
        name: 'Alerts',
        component: AlertComponent
    },
    {
        path: "/reports",
        name: "Reports",
        component: ReportsComponent
    },
    {
        path: '/report-create',
        name: 'report-create',
        component: ReportCreateAndEdit
    },
    {
        path: '/report-edit/:id',
        name: 'report-edit',
        component: ReportCreateAndEdit,
        props: true
    },
    {
        path: '/inventory/id_i/products',
        name: 'product-management',
        component: InventoryComponent
    },
    {
        path: '/inventory/id_i/products/new',
        name: 'product-create',
        component: ProductCreateAndEditComponent
    },
    {
        path: '/inventory/id_i/products/edit/:id_p',
        name: 'product-edit',
        component: ProductCreateAndEditComponent,
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router