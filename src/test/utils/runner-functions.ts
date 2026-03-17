import { ITransitionData } from "@barba/core";

export async function runModuleDefault(data: ITransitionData | null = null, file: string, testEl: string = "default") {
    if (testEl !== "default") {
        const nextCont = data?.next.container;
        if (!nextCont) return;
        if (!nextCont.querySelector(testEl)) return;
    }

    const module = await import(`../modules/${file}.ts`);
    module.default(data);
}

export async function runComponentDefault(data: ITransitionData | null = null, file: string, testEl: string = "default") {
    if (testEl !== "default") {
        const nextCont = data?.next.container;
        if (!nextCont) return;
        if (!nextCont.querySelector(testEl)) return;
    }

    const module = await import(`../components/${file}.ts`);
    module.default(data);
}

export async function runDefault(file: string) {
    const module = await import(`../base/${file}.ts`);
    module.default();
}

export async function runLayoutDefault(file: string, data: ITransitionData | null = null) {
    const module = await import(`../layout/${file}.ts`);
    module.default(data);
}

export async function runUtils(file: string) {
    const module = await import(`../utils/${file}.ts`);
    module.default();
}
