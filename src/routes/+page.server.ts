import { addReply } from "#lib/data.ts";
import type { Actions } from "./$types";

export const actions: Actions = {
    save: async ({request}) => {
        const data = await request.formData()
        data.forEach((text, id) => addReply(id, text.toString()));
        return "success";
    }
} satisfies Actions;