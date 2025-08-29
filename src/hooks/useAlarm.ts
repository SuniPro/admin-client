import { useEffect, useRef } from "react";
import useSound from "use-sound";
import alarmSound from "../assets/sound/alert/alert.mp3";

export function useAlarm(condition: boolean) {
  const previousConditionRef = useRef<boolean>(condition);
  const [play] = useSound(alarmSound);

  useEffect(() => {
    if (!previousConditionRef.current && condition) {
      // 🔔 false → true 로 바뀔 때만 알람
      play();
    }
    previousConditionRef.current = condition;
  }, [condition, play]);
}
