import PhonePePaymentGateway from "./service";
import { 
  ModuleProvider, 
  Modules
} from "@medusajs/framework/utils";

export default ModuleProvider(Modules.PAYMENT, {
  services: [PhonePePaymentGateway], // Use the factory method here
});
