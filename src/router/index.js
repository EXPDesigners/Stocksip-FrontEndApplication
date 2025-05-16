import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../authentication/pages/login.component.vue'
import RegisterComponent from '../authentication/pages/register.component.vue'
import PasswordRecoveryComponent from '../authentication/pages/password-recovery.component.vue'
import ConfirmationCodeComponent from '../authentication/pages/confirmation-code.component.vue'
import ProfileComponent from '../profile-management/pages/profile.component.vue'
import DashboardComponent from '../analytics-and-reporting/pages/dashboard.component.vue'
import AlertComponent from '../alerts-and-notifications/pages/alert-dashboard.component.vue'
import WarehouseComponent from '../inventory-management/pages/warehouse.component.vue';
import CreateAndEditWarehouse from "@/inventory-management/pages/warehouse-create-and-edit.component.vue";
import ZonesComponent from '../inventory-management/pages/zones.component.vue'

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
        path: '/warehouses',
        name: 'Warehouses',
        component: WarehouseComponent
    },
    {
        path: '/warehouses/create',
        name: 'CreateWarehouse',
        component: CreateAndEditWarehouse
    },
    {
        path: '/warehouses/edit/:id',
        name: 'EditWarehouse',
        component: CreateAndEditWarehouse,
    },
    {
        path: '/warehouses/zones/:id',
        name: 'Zones',
        component: ZonesComponent,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
