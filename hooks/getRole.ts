import { getSession } from "./session";

export default async function getRole() {
    return await getSession().then((data) => {
        return data?.Role || null;
    })
}