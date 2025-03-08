import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ClipboardList, Edit, Printer, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dbService, Paciente } from '../services/db';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DocumentoImprimible from '@/components/DocumentoImprimible';

const DetallePaciente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarDocumento, setMostrarDocumento] = useState(false);

  useEffect(() => {
    const cargarPaciente = async () => {
      if (!id) return;
      
      try {
        const pacienteData = await dbService.obtenerPacientePorId(parseInt(id));
        if (pacienteData) {
          setPaciente(pacienteData);
        } else {
          toast.error('Paciente no encontrado');
          setTimeout(() => navigate('/'), 1500);
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
        toast.error('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [id, navigate]);

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Fecha no válida';
      return format(date, 'PPP', { locale: es });
    } catch (e) {
      return 'Fecha no válida';
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    try {
      const hoy = new Date();
      const fechaNac = new Date(fechaNacimiento);
      
      if (isNaN(fechaNac.getTime())) return 'Fecha no válida';
      
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        return `${edad - 1} años`;
      }
      
      if (edad === 0) {
        const meses = hoy.getMonth() - fechaNac.getMonth() + 
          (hoy.getDate() < fechaNac.getDate() ? -1 : 0) + 
          (hoy.getMonth() < fechaNac.getMonth() ? 12 : 0);
        
        if (meses === 0) {
          const dias = Math.floor((hoy.getTime() - fechaNac.getTime()) / (1000 * 60 * 60 * 24));
          return `${dias} días`;
        }
        
        return `${meses} meses`;
      }
      
      return `${edad} años`;
    } catch (e) {
      return 'Error en fecha';
    }
  };

  const SeccionEncabezado = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800/80 dark:text-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {paciente?.nombre} {paciente?.apellido}
          </h2>
          
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <ClipboardList className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">HC: {paciente?.numeroHistoriaClinica}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Fecha de nacimiento: {formatearFecha(paciente?.fechaNacimiento || '')}
              </span>
            </div>
            
            <div className="flex items-center">
              <User className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Sexo: {paciente?.sexo === 'M' ? 'Masculino' : paciente?.sexo === 'F' ? 'Femenino' : paciente?.sexo || 'No especificado'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Edad: {calcularEdad(paciente?.fechaNacimiento || '')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline"
            onClick={() => setMostrarDocumento(true)}
            className="border-medical-600 text-medical-600 hover:bg-medical-50 dark:text-medical-300 dark:border-medical-300 dark:hover:bg-gray-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Epicrisis
          </Button>
          
          <Button 
            className="bg-medical-600 hover:bg-medical-700 text-white" 
            onClick={() => navigate(`/editar-paciente/${id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </div>
  );

  const SeccionDatosNacimiento = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos de Nacimiento</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Peso</p>
          <p className="font-medium text-gray-800">{paciente?.peso || '-'} g</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Talla</p>
          <p className="font-medium text-gray-800">{paciente?.talla || '-'} cm</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Perímetro Cefálico</p>
          <p className="font-medium text-gray-800">{paciente?.perimetroCefalico || '-'} cm</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Edad Gestacional</p>
          <p className="font-medium text-gray-800">{paciente?.edadGestacional || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">APGAR</p>
          <p className="font-medium text-gray-800">{paciente?.apgar || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">DDV</p>
          <p className="font-medium text-gray-800">{paciente?.ddv || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">HC</p>
          <p className="font-medium text-gray-800">{paciente?.hc || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Pulsera</p>
          <p className="font-medium text-gray-800">{paciente?.pulsera || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Hora de Nacimiento</p>
          <p className="font-medium text-gray-800">{paciente?.horaNacimiento || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionDatosParto = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Parto</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nacido Por</p>
          <p className="font-medium text-gray-800">{paciente?.nacidoPor || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Presentación</p>
          <p className="font-medium text-gray-800">{paciente?.presentacion || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Líquido Amniótico</p>
          <p className="font-medium text-gray-800">{paciente?.liquidoAmniotico || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Ruptura de Membranas</p>
          <p className="font-medium text-gray-800">{paciente?.rupturaMembranas || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Clasificación</p>
          <p className="font-medium text-gray-800">{paciente?.clasificacion || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Procedencia</p>
          <p className="font-medium text-gray-800">{paciente?.procedencia || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionPersonalMedico = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Médico</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Sector de Internación</p>
          <p className="font-medium text-gray-800">{paciente?.sectorInternacion || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Obstetra</p>
          <p className="font-medium text-gray-800">{paciente?.obstetra || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Enfermera</p>
          <p className="font-medium text-gray-800">{paciente?.enfermera || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Neonatólogo/a</p>
          <p className="font-medium text-gray-800">{paciente?.neonatologo || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionVacunacionPesquisa = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacunación y Pesquisa</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {paciente?.vacunacionHbsag && (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Vacunación HBsAg
          </Badge>
        )}
        
        {paciente?.vacunacionBcg && (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Vacunación BCG
          </Badge>
        )}
        
        {paciente?.pesquisaMetabolica && (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Pesquisa Metabólica
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Grupo y Factor</p>
          <p className="font-medium text-gray-800">{paciente?.grupoFactor || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Laboratorios</p>
          <p className="font-medium text-gray-800">{paciente?.laboratorios || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionDatosMaternos = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Maternos</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">Datos Maternos Generales</p>
        <p className="font-medium text-gray-800">{paciente?.datosMaternos || '-'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">SARS-CoV-2 (PCR)</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.sarsCov2 === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.sarsCov2 === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.sarsCov2 || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Chagas</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.chagas === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.chagas === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.chagas || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Toxoplasmosis</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.toxoplasmosis === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.toxoplasmosis === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.toxoplasmosis || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">HIV</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.hiv === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.hiv === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.hiv || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">VDRL</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.vdrl === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.vdrl === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.vdrl || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Hepatitis B</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.hepatitisB === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.hepatitisB === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.hepatitisB || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">EGB</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.egb === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.egb === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.egb || 'No realizado'}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Paciente no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">No se encontró información para este paciente.</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <button 
            onClick={() => navigate('/')}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detalles del Paciente</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <SeccionEncabezado />
          
          <SeccionDatosNacimiento />
          
          <SeccionDatosParto />
          
          <SeccionPersonalMedico />
          
          <SeccionVacunacionPesquisa />
          
          <SeccionDatosMaternos />
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista de pacientes
            </Button>
          </div>
        </motion.div>
      </div>
      
      {mostrarDocumento && paciente && (
        <DocumentoImprimible 
          paciente={paciente} 
          onClose={() => setMostrarDocumento(false)} 
        />
      )}
    </div>
  );
};

export default DetallePaciente;
