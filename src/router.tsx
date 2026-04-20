import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { HomePage }          from '@/pages/HomePage'
import { ProductsPage }      from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CheckoutPage }      from '@/pages/CheckoutPage'
import { AccountPage }       from '@/pages/AccountPage'
import { NotFoundPage }      from '@/pages/NotFoundPage'
import { AdminPage }         from '@/pages/admin/AdminPage'
import { AdminOrdersPage }   from '@/pages/admin/AdminOrdersPage'
import { OrdersPage }        from '@/pages/user/OrdersPage'
import { WishlistPage }      from '@/pages/user/WishlistPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,             element: <HomePage /> },
      { path: 'products',        element: <ProductsPage /> },
      { path: 'products/:slug',  element: <ProductDetailPage /> },
      { path: 'wishlist',        element: <WishlistPage /> },
      {
        path: 'checkout',
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
      },
      {
        path: 'account',
        element: <ProtectedRoute><AccountPage /></ProtectedRoute>,
      },
      {
        path: 'orders',
        element: <ProtectedRoute><OrdersPage /></ProtectedRoute>,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin',        element: <AdminPage /> },
  { path: '/admin/orders', element: <AdminOrdersPage /> },
])
