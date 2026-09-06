// Utilidades de formato de fechas en español para Equilibria

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MONTH_NAMES_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const WEEKDAY_NAMES_ES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const WEEKDAY_NAMES_SHORT_ES = [
  'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
];

/**
 * Parsea una fecha en formato YYYY-MM-DD sin desajustes por zona horaria UTC
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

/**
 * Formatea una fecha completa con Día de la semana, Día (número), Mes y Año
 * Ejemplo: "Lunes, 7 de Septiembre de 2026"
 */
export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const weekday = WEEKDAY_NAMES_ES[d.getDay()];
  const day = d.getDate();
  const month = MONTH_NAMES_ES[d.getMonth()];
  const year = d.getFullYear();

  return `${weekday}, ${day} de ${month} de ${year}`;
}

/**
 * Formato explícito Día, Mes y Año
 * Ejemplo: "7 de Septiembre de 2026"
 */
export function formatDayMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const day = d.getDate();
  const month = MONTH_NAMES_ES[d.getMonth()];
  const year = d.getFullYear();

  return `${day} de ${month} de ${year}`;
}

/**
 * Desglosa la fecha en partes individuales para componentes visuales
 */
export function getDateBreakdown(dateStr: string) {
  const d = parseLocalDate(dateStr);
  if (isNaN(d.getTime())) {
    return {
      dayNumber: 1,
      weekday: '',
      weekdayShort: '',
      monthName: '',
      monthShort: '',
      year: new Date().getFullYear(),
      fullText: dateStr
    };
  }

  const dayNumber = d.getDate();
  const weekday = WEEKDAY_NAMES_ES[d.getDay()];
  const weekdayShort = WEEKDAY_NAMES_SHORT_ES[d.getDay()];
  const monthName = MONTH_NAMES_ES[d.getMonth()];
  const monthShort = MONTH_NAMES_SHORT_ES[d.getMonth()];
  const year = d.getFullYear();

  return {
    dayNumber,
    weekday,
    weekdayShort,
    monthName,
    monthShort,
    year,
    fullText: `${weekday}, ${dayNumber} de ${monthName} de ${year}`
  };
}

/**
 * Genera los próximos N días con día, mes y año completos para selectores
 */
export function getUpcomingDays(count: number = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isToday = i === 0;
    const isTomorrow = i === 1;

    return {
      dateStr,
      dayNumber: d.getDate(),
      dayName: isToday ? 'Hoy' : isTomorrow ? 'Mañana' : WEEKDAY_NAMES_SHORT_ES[d.getDay()],
      weekdayFull: WEEKDAY_NAMES_ES[d.getDay()],
      monthName: MONTH_NAMES_SHORT_ES[d.getMonth()],
      monthFull: MONTH_NAMES_ES[d.getMonth()],
      year: d.getFullYear(),
      displayLabel: `${d.getDate()} ${MONTH_NAMES_SHORT_ES[d.getMonth()]} ${d.getFullYear()}`
    };
  });
}

/**
 * Calcula la próxima fecha calendario con Día, Mes y Año para un patrón semanal de clases
 */
export function getNextDateForSchedule(dayPattern: string): { dateStr: string; fullText: string; dayMonthYear: string } {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
  const lower = dayPattern.toLowerCase();

  let targetDays: number[] = [];
  if (lower.includes('lunes a viernes')) {
    targetDays = [1, 2, 3, 4, 5];
  } else {
    if (lower.includes('lunes')) targetDays.push(1);
    if (lower.includes('martes')) targetDays.push(2);
    if (lower.includes('miércoles') || lower.includes('miercoles')) targetDays.push(3);
    if (lower.includes('jueves')) targetDays.push(4);
    if (lower.includes('viernes')) targetDays.push(5);
    if (lower.includes('sábado') || lower.includes('sabado')) targetDays.push(6);
    if (lower.includes('domingo')) targetDays.push(0);
  }

  if (targetDays.length === 0) {
    const todayIso = today.toISOString().slice(0, 10);
    return {
      dateStr: todayIso,
      fullText: formatFullDate(todayIso),
      dayMonthYear: formatDayMonthYear(todayIso)
    };
  }

  // Encontrar el día más próximo
  let minDiff = 14;
  for (const target of targetDays) {
    let diff = (target - currentDayOfWeek + 7) % 7;
    if (diff < minDiff) {
      minDiff = diff;
    }
  }

  const result = new Date(today);
  result.setDate(today.getDate() + minDiff);
  const year = result.getFullYear();
  const month = String(result.getMonth() + 1).padStart(2, '0');
  const day = String(result.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return {
    dateStr,
    fullText: formatFullDate(dateStr),
    dayMonthYear: formatDayMonthYear(dateStr)
  };
}
