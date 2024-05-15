export default function (date: Date) {
    const currentDate = date;
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);
    return (currentDate < nextMonday) ? 52 : (currentDate > nextMonday ? Math.ceil((currentDate.getTime() - nextMonday.getTime()) / (24 * 3600 * 1000) / 7) : 1);
  }
