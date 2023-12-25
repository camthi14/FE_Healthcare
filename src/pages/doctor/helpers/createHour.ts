type CreateHourPayload = {
  hourStart: number;
  minuteStart: number;
  timeCheckupAvg: number;
  shifts: any[];
  results: any[];
};

export function createHour({
  hourStart,
  minuteStart,
  shifts,
  timeCheckupAvg,
  results,
}: CreateHourPayload): { end: string; start: string }[] {
  if (shifts.length === 0) {
    return results;
  }

  if (results.length) {
    minuteStart += timeCheckupAvg;

    if (minuteStart >= 60) {
      hourStart += 1;

      if (minuteStart === 60) {
        minuteStart = 0;
      }

      if (minuteStart > 60) {
        minuteStart -= 60;
      }
    }
  }

  let _minuteEnd = minuteStart + timeCheckupAvg;
  let _hourEnd = hourStart;

  if (_minuteEnd > 60) {
    _minuteEnd -= 60;
    _hourEnd += 1;
  }

  if (_minuteEnd === 60) {
    _minuteEnd = 0;
    _hourEnd += 1;
  }

  results.push({
    start: `${hourStart < 10 ? `0${hourStart}` : hourStart}:${
      minuteStart === 0 ? "00" : minuteStart
    }`,
    end: `${_hourEnd < 10 ? `0${_hourEnd}` : _hourEnd}:${_minuteEnd === 0 ? "00" : _minuteEnd}`,
  });

  return createHour({
    hourStart,
    minuteStart,
    shifts: shifts.slice(1),
    timeCheckupAvg,
    results,
  });
}
