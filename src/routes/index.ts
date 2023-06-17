import { type Application, type Router } from 'express'

import { ProductRouter } from './product_route'
import { AuthRouter } from './auth_route'

const _routes: Array<[string, Router]> = [
  ['/product', ProductRouter],
  ['/auth', AuthRouter]
]

export function routes(app: Application): void {
  _routes.forEach((route) => {
    const [url, router] = route
    app.use(url, router)
  })
}
