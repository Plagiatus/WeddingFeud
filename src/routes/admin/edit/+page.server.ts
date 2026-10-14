import { addOrModifyQuestion, setReplies } from "#lib/data.ts";
import type { Actions } from "./$types";

export const actions: Actions = {
    save: async ({ request }) => {
        const data = await request.formData()
        data.forEach((text, id) => {
            if(id.endsWith(".replies")){
                id = id.slice(0, id.length - 8);
                let replies = (text as string).split("\r\n");
                console.log(id, replies);
                setReplies(id, replies);
            } else {
                addOrModifyQuestion(id, text.toString())
            }
        });
    }
} satisfies Actions;