const dayCounter = (days: number) => {
  if (days % 10 == 1) {
    return days.toString() + ' день'
  } else if (days == 11 || days == 12 || days == 13 || days == 14) {
    return days.toString() + ' дней'
  } else if (days % 10 == 2 || days % 10 == 3 || days % 10 == 4) {
    return days.toString() + ' дня'
  } else {
    return days.toString() + ' дней'
  }
}
export default dayCounter
