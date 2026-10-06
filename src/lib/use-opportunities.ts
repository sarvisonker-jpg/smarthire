import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchOpportunities } from "./opportunities";

export const opportunitiesQuery = queryOptions({
  queryKey: ["opportunities"],
  queryFn: fetchOpportunities,
  staleTime: Infinity,
});

export const useOpportunities = () => useQuery(opportunitiesQuery);
