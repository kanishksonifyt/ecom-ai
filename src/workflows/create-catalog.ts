
import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
  } from "@medusajs/framework/workflows-sdk";
  import { CATALOG_MODULE } from "../modules/catalog";
  import CatalogModuleService from "../modules/catalog/service";
  import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
  
  // Create Catalog
  export type CreateCatalogStepInput = {
    image: string;
    link: string;
  };
  
  export const createCatalogStep = createStep(
    "create-catalog-step",
    async (input: CreateCatalogStepInput, { container }) => {
      const catalogService: CatalogModuleService = container.resolve(CATALOG_MODULE);
  
      const catalog = await catalogService.createCatalogs({
        image: input.image,
        link: input.link,
      });
  
      return new StepResponse(catalog, catalog.id);
    }
  );
  
  export const createCatalogWorkflow = createWorkflow(
    "create-catalog",
    (input: CreateCatalogStepInput) => {
      const catalog = createCatalogStep(input);
  
      return new WorkflowResponse(catalog);
    }
  );
  
  // Get Catalog by ID
  export type GetCatalogByIdStepInput = {
    id: string;
  };
  
  export const getCatalogByIdStep = createStep(
    "get-catalog-by-id-step",
    async (input: GetCatalogByIdStepInput, { container }) => {
      const catalogService: CatalogModuleService = container.resolve(CATALOG_MODULE);
  
      const catalog = await catalogService.listCatalogs(input.id);
  
      return new StepResponse(catalog, catalog[0].id);
    }
  );
  
  export const getCatalogByIdWorkflow = createWorkflow(
    "get-catalog-by-id",
    (input: GetCatalogByIdStepInput) => {
      const catalog = getCatalogByIdStep(input);
  
      return new WorkflowResponse(catalog);
    }
  );
  
  // Delete Catalog
  export type DeleteCatalogStepInput = {
    id: string;
  };
  
  export const deleteCatalogStep = createStep(
    "delete-catalog-step",
    async (input: DeleteCatalogStepInput, { container }) => {
      const catalogService: CatalogModuleService = container.resolve(CATALOG_MODULE);
  
      await catalogService.deleteCatalogs(input.id);
  
      return new StepResponse(null, input.id);
    }
  );
  
  export const deleteCatalogWorkflow = createWorkflow(
    "delete-catalog",
    (input: DeleteCatalogStepInput) => {
      const catalog = deleteCatalogStep(input);
  
      return new WorkflowResponse(catalog);
    }
  );
  
  // Edit Catalog
  export type EditCatalogStepInput = {
    id: string;
    image?: string;
    link?: string;
  };
  
  export const editCatalogStep = createStep(
    "edit-catalog-step",
    async (input: EditCatalogStepInput, { container }) => {
      const catalogService: CatalogModuleService = container.resolve(CATALOG_MODULE);
  
    const updatedCatalog = await catalogService.updateCatalogs({
        id: input.id,
        image: input.image,
        link: input.link,
    });
  
      return new StepResponse(updatedCatalog, updatedCatalog.id);
    }
  );
  
  export const editCatalogWorkflow = createWorkflow(
    "edit-catalog",
    (input: EditCatalogStepInput) => {
      const catalog = editCatalogStep(input);
  
      return new WorkflowResponse(catalog);
    }
  );
  

  // Get All Catalogs
  export const getAllCatalogsStep = createStep(
    "get-all-catalogs-step",
    async (_, { container }) => {
      const catalogService: CatalogModuleService = container.resolve(CATALOG_MODULE);

      const catalogs = await catalogService.listCatalogs();

      return new StepResponse(catalogs, catalogs.map(catalog => catalog.id));
    }
  );

  export const getAllCatalogsWorkflow = createWorkflow(
    "get-all-catalogs",
    () => {
      const catalogs = getAllCatalogsStep();

      return new WorkflowResponse(catalogs);
    }
  );