export function getNextSevenDays() {
  const days = [];
  const today = new Date();


  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();

    days.push({
      dateStr,
      weekday,
      dayNumber,
      isToday: i === 0,
    });
  }

  return days;


}