function getUnixTime(time: string | null) {
  if (time == null) {
    return null
  }
  return new Date(time ? time : '').getTime() / 1000
}

function getStringDate(unixTime: number | null) {
  if (unixTime == null) {
    return null
  }

  return new Date((unixTime ? unixTime : 0) * 1000).toISOString().slice(0, 10)
}

function addZero(m: number) {
  return m < 10 ? '0' + m : m
}
function getDateFromUnix(timeunix: number, type: string) {
  const time = new Date(timeunix * 1000)

  const month = [
    'янв.',
    'фев.',
    ',мар.',
    'апр.',
    'мая',
    'июня',
    'июля',
    'авг.',
    'сен.',
    'окт.',
    'ноя.',
    'дек.',
  ]

  const y = time.getFullYear()
  const m = time.getMonth() + 1 // Getmonth is obtained in the month (0--11), and the actual month needs +1 to get it
  const d = time.getDate()
  const h = time.getHours()
  const mm = time.getMinutes()
  const s = time.getSeconds()
  let realtime = ''
  if (type === 'date') {
    realtime = addZero(d) + '.' + addZero(m) + '.' + y
  } else if (type == 'hour') {
    realtime = addZero(h) + ':' + addZero(mm)
  } else if (type == 'datehour') {
    realtime =
      addZero(d) +
      '.' +
      addZero(m) +
      '.' +
      y +
      ' ' +
      addZero(h) +
      ':' +
      addZero(mm)
  } else if (type == 'datehourTF') {
    realtime =
    y +
'-' +
    addZero(m) +
    '-' +
      addZero(d) +
      'T' +
      addZero(h) +
      ':' +
      addZero(mm)
  } else if (type == 'dayAndMonthName') {
    realtime = addZero(d) + ' ' + month[m - 1]
  } else {
    realtime =
      y +
      '-' +
      addZero(m) +
      '-' +
      addZero(d) +
      ' ' +
      addZero(h) +
      ':' +
      addZero(mm) +
      ':' +
      addZero(s)
  }

  return realtime
}

export { getDateFromUnix, getUnixTime, getStringDate }
