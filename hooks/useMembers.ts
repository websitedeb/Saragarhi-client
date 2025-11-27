import { useQuery } from "@tanstack/react-query";

export function useMembers(teamNumber: number) {
    return useQuery({
        queryKey: ["members", teamNumber],
        queryFn: async () => {
            const response = await fetch(`https://saragarhi-api-database-test.sarthak22-ghoshal.workers.dev/getAllMembersOfTeamThatAreScoutersAndCaptains`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamCode: teamNumber }),
            });
            const data = await response.json();
            if (!data?.success) {
                throw new Error("API returned unsuccessful response");
            }  
            return data.members || [];
        },
        staleTime: 0,
    });
} 