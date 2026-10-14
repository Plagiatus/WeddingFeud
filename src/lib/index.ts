// place files you want to import through the `#lib` alias in this folder.

export async function postRequest(url: string, body: string) {
    return fetch(url, {
        method: "POST",
        body,
        headers: { "Content-Type": "text/plain" },
    });
}