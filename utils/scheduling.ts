import { v1 as uuid } from "uuid";

import type { HumanDay } from "@/types/form";

export const getNewGroupTimes = () => {
  const d = new Date();
  const closestHour = d.getHours() + Math.round(d.getMinutes() / 60);

  if (closestHour === 24) {
    return { id: uuid(), start: "00:00", end: "01:00" };
  }

  return {
    id: uuid(),
    start: `${closestHour.toString().padStart(2, "0")}:00`,
    end: `${(closestHour + 1).toString().padStart(2, "0")}:00`,
  };
};

export const toHumanDay = (day: string): HumanDay => {
  return {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  }[day] as HumanDay;
};
