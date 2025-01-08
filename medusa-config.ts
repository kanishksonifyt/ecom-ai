import { loadEnv, defineConfig } from "@medusajs/framework/utils";
import { Modules } from "@medusajs/framework/utils";
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
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/razorpay-payment",
            id: "razorpay",
            options: {},
          },
        ],
      },
    },
    {
      resolve: "./src/modules/cms",
      options: {
        apiKey: process.env.CMS_API_KEY,
      },
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
