import { DB_URL } from '@/constants/constants';
import { useQuery } from "@tanstack/react-query";

export function useMembers(teamNumber: number, sign : string) {
    return useQuery({
        queryKey: ["members", teamNumber],
        queryFn: async () => {
            const response = await fetch(
                `${DB_URL}/getAllMembersOfTeamThatAreScoutersAndCaptains?sign=${sign}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ teamCode: teamNumber }),
                }
            );
            const data = await response.json();
            if (!data?.success) throw new Error("API returned unsuccessful response");
            return data.members || [];
        },

        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    });
}