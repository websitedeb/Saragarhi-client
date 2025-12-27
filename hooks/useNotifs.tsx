import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";
import { getSession } from "./session";

type TimetableEntry = {
  id: string;
  Team: string;
  Time: string;
  Date: string;
};

export async function requestNotificationPermission() { const { status } = await Notifications.getPermissionsAsync(); if (status !== "granted") { await Notifications.requestPermissionsAsync(); } if (Platform.OS === "android") { await Notifications.setNotificationChannelAsync("default", { name: "default", importance: Notifications.AndroidImportance.MAX, }); } return status === "granted"; }

export async function useNotifs(title: string, body: string) {
  const session = await getSession();
  if (!session) return;

  const timetable: TimetableEntry[] = JSON.parse(session.timeTable);
  if (!Array.isArray(timetable)) return;

  const now = Date.now();

  for (const entry of timetable) {
    const [year, month, day] = entry.Date.split("-").map(Number);
    const [hours, minutes] = entry.Time.split(":").map(Number);

    const eventTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      0,
      0
    );

    const notifyAt = new Date(eventTime.getTime() - 5 * 60 * 1000);

    if (notifyAt.getTime() <= now) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: body.replace("{team}", entry.Team),
        data: {
          url: `/scout`
        }
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: notifyAt,
      }
    });
  }
}
