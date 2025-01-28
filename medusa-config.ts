import { loadEnv, defineConfig } from "@medusajs/framework/utils";
loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      // imageuploaderCors: "http://localhost:7001",
    },
  },
  modules: [
  
    {
      resolve: "./src/modules/catalogfeatured",
    },

  
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-razor-payemnt",
            id: "my-razor-payemnt",
            options: {
              // provider options...
              apiKey: "rzp_test_v9OipkUZNTnkXj"
            }
          }
        ]
      }
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
          {
            resolve: "./src/modules/my-fulfillment",
            id : "shiprocket-fulfillment",
            options: {
              email: process.env.SHIPROCKET_EMAIL, //(required)
              password: process.env.SHIPROCKET_PASSWORD, //(required)
              base_url: process.env.SHIPROCKET_BASE_URL, //(required)
            }
          }
        ]
      }
    },
    {
      resolve: "./src/modules/point",
    },

    {
      resolve: "./src/modules/hero",
    },
    {
      resolve: "./src/modules/highlights",
    },
    {
      resolve: "./src/modules/catalog",
    },
    {
      resolve: "./src/modules/featured",
    },
    {
      resolve: "./src/modules/item",
    },
    {
      resolve: "./src/modules/showathome",
    },
    {
      resolve: "./src/modules/review",
    },
    {
      resolve: "./src/modules/homepage",
    },
  ],
});
