import { 
    defineMiddlewares,
    validateAndTransformBody,
  } from "@medusajs/framework/http"
  import { PostAdminCreateHero } from "./admin/hero/validators"
  import { PostAdminCreateHighlight} from "./admin/highlight/validators"
  import { PostAdminCreateCatalog } from "./admin/catalog/validators"
  import {PostAdminCreateShowonhome} from './admin/showonhome/[id]/validators'
  import { z } from "zod"
  
  export default defineMiddlewares({
    routes: [
      {
        matcher: "/admin/hero",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateHero),
        ],
      },
      {
        matcher: "/admin/highlight",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateHighlight),
        ],
      },
      {
        matcher: "/admin/catalog",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateCatalog),
        ],
      },
      {
        method: "POST",
        matcher: "/admin/products",
        additionalDataValidator: {
          show_on_homepage: z.boolean().optional(),
        },
      },
      {
        matcher: "/admin/showonhome",
        method: "POST",
        middlewares: [
          validateAndTransformBody(PostAdminCreateShowonhome),
        ],
      },
    ],
  })