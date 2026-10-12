import { addOrModifyQuestion } from "#lib/data.ts";
import type { Actions } from "./$types";

export const actions: Actions = {
    save: async ({request}) => {
        const data = await request.formData()
        data.forEach((text, id) => addOrModifyQuestion(id, text.toString()));
    }
} satisfies Actions;