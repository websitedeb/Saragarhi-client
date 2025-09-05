import { AT } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';
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
        'X-TBA-Auth-Key': `${AT}`,
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

export const useAllTeams = () => {
  const event = useEvent(state => state.event);

  return useQuery({
    queryKey: ['all-teams', event],
    queryFn: () => fetchAllTeams(event),
    staleTime: 1000 * 60 * 60,
  });
};

const fetchEventRankings = async (eventKey: string) => {
  if (!eventKey) return [];

  const url = `https://www.thebluealliance.com/api/v3/event/${eventKey || "2025alhu"}/teams/statuses`;

  const res = await fetch(url, {
    headers: {
      "X-TBA-Auth-Key": AT,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  return Object.entries(data).map(([team_key, status]: [string, any]) => ({
    team_key,
    rank: status?.qual?.ranking?.rank ?? null,
    matches_played: status?.qual?.ranking?.matches_played ?? 0,
    qual_average: status?.qual?.ranking?.qual_average ?? 0,
    record: status?.qual?.ranking?.record ?? { wins: 0, losses: 0, ties: 0 },
    overall_status: status?.overall_status_str ?? "",
    alliance_status: status?.alliance_status_str ?? "",
    playoff_status: status?.playoff_status_str ?? "",
  }));
};

export const useDistrictRankings = () => {
  const event = useEvent(state => state.event);

  return useQuery({
    queryKey: ['district', event],
    queryFn: () => fetchEventRankings(event),
    staleTime: 1000 * 60 * 60,
  });
};
