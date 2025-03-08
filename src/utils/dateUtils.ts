
import { format, parse } from 'date-fns';

/**
 * Formatea una fecha en formato yyyy-MM-dd a un formato legible (dd/MM/yyyy)
 */
export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    // Parsear la fecha de formato ISO (yyyy-MM-dd) a un objeto Date
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    
    // Formatear la fecha al formato deseado
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};
