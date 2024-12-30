import { MedusaService } from "@medusajs/framework/utils";
import { Highlight } from "./models/highlights";

class HighlightModuleService extends MedusaService({
    Highlight,
}) {}

export default HighlightModuleService;
