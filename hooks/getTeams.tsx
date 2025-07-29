
const fetchAllTeams = async () => {
  let allTeams : any[] = [];
  let page = 0;
  const MAX_PAGES = 20;

  while (page < MAX_PAGES) {
    const res = await fetch(`https://www.thebluealliance.com/api/v3/teams/${page}/simple`, {
      headers: {
        'X-TBA-Auth-Key': 'Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x'//`${Constants.expoConfig?.extra?.TBA}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    if (data.length === 0) break;

    allTeams = [...allTeams, ...data];
    page++;
  }

  return allTeams;
};


import { useQuery } from '@tanstack/react-query';

export const  useAllTeams = () =>
  useQuery({
    queryKey: ['all-teams'],
    queryFn: fetchAllTeams,
    staleTime: 1000 * 60 * 60,
  });
