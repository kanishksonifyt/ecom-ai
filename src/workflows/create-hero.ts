import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { HERO_MODULE } from "../modules/hero";
import HeroModuleService from "../modules/hero/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export type CreateHeroStepInput = {
  title: string;
  subtitle: string;
  firsttext: string;
  secondtext: string;
  image: string;
  index: number;
};

export const createHeroStep = createStep(
  "create-hero-step",
  async (input: CreateHeroStepInput, { container }) => {
    const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);

    // Ensure the hero data has an index
    const existingHeroes = await HeroModuleService.listHeroes();
    const heroIndex = existingHeroes.length + 1;
    input.index = heroIndex;

    const hero = await HeroModuleService.createHeroes(input);

    return new StepResponse(hero, hero.id);
  }
);



type CreateHeroWorkflowInput = {
    title: string;
    subtitle: string;
    firsttext: string;
    secondtext: string;
    image: string;
    index: number;
};

export const createHeroWorkflow = createWorkflow(
  "create-hero",
  (input: CreateHeroWorkflowInput) => {
    const hero = createHeroStep(input);

    return new WorkflowResponse(hero);
  }
);

export type GetHeroStepInput = {
    id: string;
};

export const getHeroStep = createStep(
    "get-hero-step",
    async (input: GetHeroStepInput, { container }) => {
        const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);

        const heroes = await HeroModuleService.listHeroes();

        return new StepResponse(heroes, heroes.map(hero => hero.id));
    }
);

type GetHeroWorkflowInput = {
    id: string;
};

export const getHeroWorkflow = createWorkflow(
    "get-hero",
    (input: GetHeroWorkflowInput) => {
        const hero = getHeroStep(input);

        return new WorkflowResponse(hero);
    }
);


// Type for the Delete Hero Step Input
export type DeleteHeroStepInput = {
    id: string;
};

// Step to delete a hero
export const deleteHeroStep = createStep(
    "delete-hero-step",
    async (input: DeleteHeroStepInput, { container }) => {
        const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);

        // Delete the hero using the provided ID
        await HeroModuleService.deleteHeroes(input.id);

        // Respond with the ID of the deleted hero
        return new StepResponse(null, input.id);
    }
);

// Type for the input to the Delete Hero Workflow
type DeleteHeroWorkflowInput = {
    id: string;
};

// Workflow for deleting a hero
export const deleteHeroWorkflow = createWorkflow(
    "delete-hero",
    (input: DeleteHeroWorkflowInput) => {
        // Execute the delete hero step
        const hero = deleteHeroStep(input);

        return new WorkflowResponse(hero);
    }
);



export type EditHeroStepInput = {
    id: string;
    title?: string;
    subtitle?: string;
    firsttext?: string;
    secondtext?: string;
    image?: string;
};

export const editHeroStep = createStep(
    "edit-hero-step",
    async (input: EditHeroStepInput, { container }) => {
        const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);

        console.log(input)

        const herofound = await HeroModuleService.retrieveHero(input.id)

        console.log("heroof ound" , herofound) 

        const updatedHero = await HeroModuleService.updateHeroes({
            id: input.id,
            title: input.title,
            subtitle: input.subtitle,
            firsttext: input.firsttext,
            secondtext: input.secondtext,
            image: input.image
        });
        if (!updatedHero) {
            throw new Error(`Hero with id ${input.id} not found`);
        }

        return new StepResponse(updatedHero, updatedHero.id);
    }
);

type EditHeroWorkflowInput = {
    id: string;
    title?: string;
    subtitle?: string;
    firsttext?: string;
    secondtext?: string;
    image?: string;
};

export const editHeroWorkflow = createWorkflow(
    "edit-hero",
    (input: EditHeroWorkflowInput) => {
        const hero = editHeroStep(input);

        return new WorkflowResponse(hero);
    }
);

export type GetHeroByIdStepInput = {
    id: string;
};

export const getHeroByIdStep = createStep(
    "get-hero-by-id-step",
    async (input: GetHeroByIdStepInput, { container }) => {
        const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);

        const hero = await HeroModuleService.retrieveHero(input.id);

        return new StepResponse(hero, hero.id);
    }
);

type GetHeroByIdWorkflowInput = {
    id: string;
};

export const getHeroByIdWorkflow = createWorkflow(
    "get-hero-by-id",
    (input: GetHeroByIdWorkflowInput) => {
        const hero = getHeroByIdStep(input);

        return new WorkflowResponse(hero);
    }
);


export type ReorderHeroesStepInput = {
    id: string;
    newIndex: number;
};

export const reorderHeroesStep = createStep(
    "reorder-heroes-step",
    async (input: ReorderHeroesStepInput, { container }) => {
        const HeroModuleService: HeroModuleService = container.resolve(HERO_MODULE);
        // Retrieve the hero to be reordered
        const hero = await HeroModuleService.retrieveHero(input.id);
        if (!hero) {
            throw new Error(`Hero with id ${input.id} not found`);
        }

        // Retrieve all heroes
        const heroes = await HeroModuleService.listHeroes();

        // Remove the hero from its current position
        const filteredHeroes = heroes.filter(h => h.id !== input.id);

        console.log("filteredHeroes", filteredHeroes)

        // Insert the hero at the new index
        filteredHeroes.splice(input.newIndex - 1, 0, hero);

        // Update the index of all heroes and save to the database
        const updatedHeroes = await Promise.all(filteredHeroes.map((h, index) => {
            return HeroModuleService.updateHeroes({ id: h.id, index: index + 1 });
        }));

        return new StepResponse(updatedHeroes, updatedHeroes.map(h => h.id));
    }
);

type ReorderHeroesWorkflowInput = {
    id: string;
    newIndex: number;
};

export const reorderHeroesWorkflow = createWorkflow(
    "reorder-heroes",
    (input: ReorderHeroesWorkflowInput) => {
        const heroes = reorderHeroesStep(input);

        return new WorkflowResponse(heroes);
    }
);