import MyRazorPayemntgateway from "./service";
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils";

export default ModuleProvider(Modules.PAYMENT, {
  services: [MyRazorPayemntgateway], // Use the factory method here
});
