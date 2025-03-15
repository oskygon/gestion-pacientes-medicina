
import { format, parse, isValid } from 'date-fns';

/**
 * Formatea una fecha en formato yyyy-MM-dd a un formato legible (dd/MM/yyyy)
 * sin ajustes de zona horaria que pueden causar desplazamiento de un día
 */
export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    // Separar la fecha si viene con tiempo
    const datePart = dateString.split('T')[0];
    
    // Dividir la fecha en componentes (año, mes, día)
    const [year, month, day] = datePart.split('-').map(Number);
    
    // Verificar que tenemos componentes válidos
    if (!year || !month || !day) {
      // Intentar otros formatos comunes
      const dateFormats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'dd-MM-yyyy'];
      for (const fmt of dateFormats) {
        const parsedDate = parse(dateString, fmt, new Date());
        if (isValid(parsedDate)) {
          // Retornar en formato dd/MM/yyyy sin usar new Date() que puede ajustar la zona horaria
          return format(parsedDate, 'dd/MM/yyyy');
        }
      }
      return dateString; // Retornar el original si no se puede parsear
    }
    
    // Formatear manualmente la fecha para evitar ajustes de zona horaria
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};
