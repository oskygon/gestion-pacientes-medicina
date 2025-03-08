
import { format, parse, isValid } from 'date-fns';

/**
 * Formatea una fecha en formato yyyy-MM-dd a un formato legible (dd/MM/yyyy)
 */
export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return '';
    
    // Convertir string a objeto Date directamente
    let date = new Date(dateString);
    
    // Si la fecha no es válida, intentar parsear usando date-fns
    if (!isValid(date)) {
      date = parse(dateString, 'yyyy-MM-dd', new Date());
    }
    
    // Verificar nuevamente si la fecha es válida
    if (!isValid(date)) return dateString;
    
    // Formatear la fecha al formato deseado
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};
