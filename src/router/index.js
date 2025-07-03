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
import InventoryComponent from "@/inventory-management/pages/inventory.component.vue";

import ProductCreateAndEditComponent from "@/inventory-management/pages/product-create-and-edit.component.vue";

import ReportsComponent from '../analytics-and-reporting/pages/report-management.component.vue'
import ReportCreateAndEdit from '../analytics-and-reporting/pages/report-create-and-edit.component.vue'
import CareGuideComponent from '../inventory-management/pages/care-guide-dashboard.component.vue'
import CareGuideCreate from '../inventory-management/pages/care-guide-create-and-edit.component.vue'
import ResupplyPlanDashboard from '../inventory-management/pages/resupply-plan-dashboard.component.vue'
import ResupplyPlanCreate from '../inventory-management/pages/resupply-plan-create.component.vue'
import ResupplyPlanEdit from '../inventory-management/pages/resupply-plan-edit.componet.vue'

import CatalogComponent from "@/order-operation-and-monitoring/pages/catalog.component.vue";
import CatalogCreateAndEditComponent from "@/order-operation-and-monitoring/pages/catalog-create-and-edit.component.vue";
import PurchaseOrderCreateComponent from "@/order-operation-and-monitoring/pages/purchase-order-create.component.vue";
import OrdersComponent from "@/order-operation-and-monitoring/pages/orders.component.vue";
import ProductCreateAndEdit from "@/inventory-management/pages/product-create-and-edit.component.vue";
import ProductManagementComponent from "@/inventory-management/pages/product-management.component.vue";

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
        path: '/reports/:id/losses/new',
        name: 'report-create',
        component: ReportCreateAndEdit,
        props: true
    },
    {
        path: '/reports/:id/losses/edit',
        name: 'report-edit',
        component: ReportCreateAndEdit,
        props: true
    },
    {
        path: '/reports/conservations',
        name: 'care-guide',
        component: CareGuideComponent
    },
    {
        path: '/reports/conservations/:id/new',
        name: 'care-guide-create',
        component: CareGuideCreate,
        props: true
    },
    {
        path: '/reports/conservations/:id/edit',
        name: 'care-guide-edit',
        component: CareGuideCreate,
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
    {
        path: '/warehouses',
        name: 'Warehouses',
        component: WarehouseComponent
    },
    {
        path: '/warehouses/new',
        name: 'CreateWarehouse',
        component: CreateAndEditWarehouse
    },
    {
        path: '/warehouses/edit/:warehouseId',
        name: 'EditWarehouse',
        component: CreateAndEditWarehouse,
    },
    {
        path: '/resupplies',
        name: 'Resupplies',
        component: ResupplyPlanDashboard
    },
    {
        path: '/resupplies/:id/plans/new',
        name: 'resupply-plan-create',
        component: ResupplyPlanCreate,
        props: true
    },
    {
        path: '/resupplies/:id/plans/edit',
        name: 'resupply-plan-edit',
        component: ResupplyPlanEdit,
    },
    {
        path: '/warehouses/:warehouseId/inventory',
        name: 'Inventory',
        component: InventoryComponent,
    },
    {
        path: '/catalog',
        name: 'Catalogs',
        component: CatalogComponent,
    },
    {
        path: '/catalog/new',
        name: 'New Catalog',
        component: CatalogCreateAndEditComponent,
        props: true
    },
    {
        path: '/catalog/edit/:catalogId',
        name: 'Edit Catalog',
        component: CatalogCreateAndEditComponent,
        props: true
    },
    {
        path: '/purchase-order/new/:catalogId',
        name: 'PurchaseOrderCreate',
        component: PurchaseOrderCreateComponent
    },
    {
        path: '/orders',
        name: 'PurchaseOrder',
        component: OrdersComponent
    },
    {
        path: '/products',
        name: 'ProductList',
        component: ProductManagementComponent
    },
    {
        path: '/products/new',
        name: 'ProductCreate',
        component: ProductCreateAndEdit
    },
    {
        path: '/products/:productId/edit',
        name: 'ProductEdit',
        component: ProductCreateAndEdit,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
