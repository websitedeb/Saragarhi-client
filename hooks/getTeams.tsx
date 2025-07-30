import { useEvent } from './store';

const fetchAllTeams = async (event: string) => {
  let allTeams: any[] = [];
  let page = 0;
  const MAX_PAGES = 20;

  const url = event === "" 
    ? `https://www.thebluealliance.com/api/v3/teams/${page}/simple`
    : `https://www.thebluealliance.com/api/v3/event/${event}/teams`;

  while (page < MAX_PAGES) {
    const res = await fetch(url, {
      headers: {
        'X-TBA-Auth-Key': 'Cs7SlKYcjtXTJeGskesduTVc44ensMcSSKBMUNsaydPa6GATv1EGH8tiAzUlaV6x',
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

export const useAllTeams = () => {
  const event = useEvent(state => state.event);

  return useQuery({
    queryKey: ['all-teams', event],
    queryFn: () => fetchAllTeams(event),
    staleTime: 1000 * 60 * 60,
  });
};