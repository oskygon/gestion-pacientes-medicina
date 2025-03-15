
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dbService, Paciente } from '../services/db';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays, parseISO } from 'date-fns';
import DocumentoImprimible from '@/components/DocumentoImprimible';

const NuevoPaciente = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [pacienteRegistrado, setPacienteRegistrado] = useState<Paciente | null>(null);
  const [showDocumento, setShowDocumento] = useState(false);
  
  // UTC date formatting for initial values to prevent timezone issues
  const fecha = new Date();
  const fechaActual = format(fecha, 'yyyy-MM-dd');
  const horaActual = format(fecha, 'HH:mm');

  // Combinar fecha y hora para el formulario
  const [fechaHoraNacimiento, setFechaHoraNacimiento] = useState(`${fechaActual}T${horaActual}`);
  
  const [formData, setFormData] = useState<Omit<Paciente, 'id' | 'createdAt'>>({
    nombre: '',
    apellido: '',
    fechaNacimiento: fechaActual,
    horaNacimiento: horaActual,
    numeroHistoriaClinica: '',
    sexo: '',
    peso: '',
    talla: '',
    perimetroCefalico: '',
    edadGestacional: '',
    apgar: '',
    ddv: '',
    hc: '',
    pulsera: '',
    nacidoPor: '',
    presentacion: '',
    liquidoAmniotico: '',
    rupturaMembranas: '',
    clasificacion: '',
    procedencia: '',
    sectorInternacion: '',
    obstetra: '',
    enfermera: '',
    neonatologo: '',
    vacunacionHbsag: false,
    loteHbsag: '',
    fechaHbsag: fechaActual,
    vacunacionBcg: false,
    loteBcg: '',
    fechaBcg: fechaActual,
    pesquisaMetabolica: false,
    protocoloPesquisa: '',
    fechaPesquisa: fechaActual,
    horaPesquisa: horaActual,
    grupoFactorRn: '',
    grupoFactorMaterno: '',
    pcd: '',
    bilirrubinaTotalValor: '',
    bilirrubinaDirectaValor: '',
    hematocritoValor: '',
    laboratorios: '',
    fechaEgreso: '',
    horaEgreso: '',
    pesoEgreso: '',
    evolucionInternacion: '',
    diagnosticos: '',
    indicacionesEgreso: '',
    observaciones: '',
    enfermeraEgreso: '',
    neonatologoEgreso: '',
    datosMaternos: '',
    numeroDocumento: '',
    telefono: "",
    obraSocial: "",  
    sarsCov2: '',
    chagas: '',
    toxoplasmosis: '',
    hiv: '',
    vdrl: '',
    hepatitisB: '',
    egb: '',
    profilaxisATB: ''
  });

  // Manejador para el cambio de fecha-hora combinado
  const handleFechaHoraNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFechaHoraNacimiento(value);
    
    // Separar fecha y hora para actualizar el estado
    // No aplicamos timezone offset para mantener la fecha exacta elegida por el usuario
    const [fecha, hora] = value.split('T');
    setFormData(prev => ({
      ...prev,
      fechaNacimiento: fecha,
      horaNacimiento: hora
    }));
  };

  useEffect(() => {
    if (formData.fechaNacimiento) {
      // Crear un objeto fecha combinando fecha y hora sin ajuste de timezone
      const fechaStr = `${formData.fechaNacimiento}T${formData.horaNacimiento || '00:00'}`;
      const fechaHora = new Date(fechaStr);
      const hoy = new Date();
      const diasDeVida = differenceInDays(hoy, fechaHora);
      
      setFormData(prev => ({ 
        ...prev, 
        ddv: diasDeVida.toString() 
      }));
    }
  }, [formData.fechaNacimiento, formData.horaNacimiento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.numeroHistoriaClinica) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }
    
    try {
      setSaving(true);
      const id = await dbService.agregarPaciente(formData);
      
      const pacienteCompleto = await dbService.obtenerPacientePorId(id);
      
      if (pacienteCompleto) {
        setPacienteRegistrado(pacienteCompleto);
        setShowDocumento(true);
        toast.success('Paciente registrado correctamente');
      } else {
        toast.error('Error al recuperar datos del paciente');
        setTimeout(() => {
          navigate(`/paciente/${id}`);
        }, 1000);
      }
      
      setSaving(false);
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      toast.error('Error al guardar el paciente');
      setSaving(false);
    }
  };

  const handleCloseDocumento = () => {
    setShowDocumento(false);
    if (pacienteRegistrado?.id) {
      navigate(`/paciente/${pacienteRegistrado.id}`);
    } else {
      navigate('/');
    }
  };

// Grupos de campos para mejor organización del formulario
const informacionPersonal = (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-600 mb-4">Datos del Recién Nacido</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Apellido *</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Fecha y Hora de Nacimiento *</label>
        <input
          type="datetime-local"
          name="fechaHoraNacimiento"
          value={fechaHoraNacimiento}
          onChange={handleFechaHoraNacimientoChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Número de Historia Clínica *</label>
        <input
          type="text"
          name="numeroHistoriaClinica"
          value={formData.numeroHistoriaClinica}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          required
        />
      </div>

      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Pulsera</label>
        <input
          type="text"
          name="pulsera"
          value={formData.pulsera}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Sexo</label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        >
          <option value="">Seleccionar...</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    </div>
  </div>
);

const datosNacimiento = (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-600 mb-4">Datos del Nacimiento</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Peso (g)</label>
        <input
          type="text"
          name="peso"
          value={formData.peso}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          placeholder="Ej: 3500"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Talla (cm)</label>
        <input
          type="text"
          name="talla"
          value={formData.talla}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          placeholder="Ej: 50"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Perímetro Cefálico (cm)</label>
        <input
          type="text"
          name="perimetroCefalico"
          value={formData.perimetroCefalico}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          placeholder="Ej: 34"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Edad Gestacional</label>
        <input
          type="text"
          name="edadGestacional"
          value={formData.edadGestacional}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          placeholder="Ej: 38 sem"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">APGAR</label>
        <input
          type="text"
          name="apgar"
          value={formData.apgar}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          placeholder="Ej: 9/10"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">DDV</label>
        <input
          type="text"
          name="ddv"
          value={formData.ddv}
          readOnly // Hacer el campo de solo lectura
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  </div>
);

const datosParto = (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-600 mb-4">Datos del Parto</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Nacido Por</label>
        <select
          name="nacidoPor"
          value={formData.nacidoPor}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        >
          <option value="">Seleccionar...</option>
          <option value="Parto vaginal">Parto vaginal</option>
          <option value="Cesárea">Cesárea</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Presentación</label>
        <select
          name="presentacion"
          value={formData.presentacion}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        >
          <option value="">Seleccionar...</option>
          <option value="Cefálica">Cefálica</option>
          <option value="Podálica">Podálica</option>
          <option value="Transversa">Transversa</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Líquido Amniótico</label>
        <select
          name="liquidoAmniotico"
          value={formData.liquidoAmniotico}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        >
          <option value="">Seleccionar...</option>
          <option value="Claro">Claro</option>
          <option value="Meconial">Meconial</option>
          <option value="Teñido">Teñido</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Ruptura de Membranas</label>
        <select
          name="rupturaMembranas"
          value={formData.rupturaMembranas}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        >
          <option value="">Seleccionar...</option>
          <option value="Espontánea">Espontánea</option>
          <option value="Artificial">Artificial</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Clasificación</label>
        <input
          type="text"
          name="clasificacion"
          value={formData.clasificacion}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Procedencia</label>
        <input
          type="text"
          name="procedencia"
          value={formData.procedencia}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  </div>
);

const personalMedico = (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-600 mb-4">Personal de Recepción</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Obstetra</label>
        <input
          type="text"
          name="obstetra"
          value={formData.obstetra}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Enfermera</label>
        <input
          type="text"
          name="enfermera"
          value={formData.enfermera}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">Neonatólogo/a</label>
        <input
          type="text"
          name="neonatologo"
          value={formData.neonatologo}
          onChange={handleChange}
          className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  </div>
);

const vacunacionPesquisa = (
  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-600 mb-4">Vacunación y Laboratorios</h3>
    
    <div className="mb-6">
      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Vacunación</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="vacunacionHbsag"
              name="vacunacionHbsag"
              checked={formData.vacunacionHbsag} 
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, vacunacionHbsag: checked === true }))
              }
            />
            <label htmlFor="vacunacionHbsag" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              HBsAg
            </label>
          </div>
          
          {formData.vacunacionHbsag && (
            <div className="grid grid-cols-2 gap-2 pl-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Lote</label>
                <input
                  type="text"
                  name="loteHbsag"
                  value={formData.loteHbsag}
                  onChange={handleChange}
                  className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                <input
                  type="date"
                  name="fechaHbsag"
                  value={formData.fechaHbsag}
                  onChange={handleChange}
                  className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="vacunacionBcg"
              name="vacunacionBcg"
              checked={formData.vacunacionBcg} 
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, vacunacionBcg: checked === true }))
              }
            />
            <label htmlFor="vacunacionBcg" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              BCG
            </label>
          </div>
          
          {formData.vacunacionBcg && (
            <div className="grid grid-cols-2 gap-2 pl-6">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Lote</label>
                <input
                  type="text"
                  name="loteBcg"
                  value={formData.loteBcg}
                  onChange={handleChange}
                  className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                <input
                  type="date"
                  name="fechaBcg"
                  value={formData.fechaBcg}
                  onChange={handleChange}
                  className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    
    <div className="mb-6">
      <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Laboratorios</h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pesquisaMetabolica"
            name="pesquisaMetabolica"
            checked={formData.pesquisaMetabolica} 
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, pesquisaMetabolica: checked === true }))
            }
          />
          <label htmlFor="pesquisaMetabolica" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pesquisa Metabólica
          </label>
        </div>
        
        {formData.pesquisaMetabolica && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">N° Protocolo</label>
              <input
                type="text"
                name="protocoloPesquisa"
                value={formData.protocoloPesquisa}
                onChange={handleChange}
                className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
              <input
                type="date"
                name="fechaPesquisa"
                value={formData.fechaPesquisa}
                onChange={handleChange}
                className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Hora</label>
              <input
                type="time"
                name="horaPesquisa"
                value={formData.horaPesquisa}
                onChange={handleChange}
                className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Barra de navegación superior */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="flex items-center" onClick={handleCancel}>
            <ArrowLeft className="mr-2" size={18} />
            Volver
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Nuevo Paciente</h1>
          <div className="w-24">
            {/* Espacio para equilibrar la barra */}
          </div>
        </div>

        {/* Modal para documento imprimible */}
        {showDocumento && pacienteRegistrado && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden flex flex-col shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Documento del Paciente</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseDocumento}>
                  <X size={18} />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <DocumentoImprimible paciente={pacienteRegistrado} />
              </div>
              <div className="p-4 border-t dark:border-gray-700 flex justify-end">
                <Button variant="outline" className="mr-2" onClick={handleCloseDocumento}>
                  Cerrar
                </Button>
                <Button onClick={() => window.print()}>Imprimir</Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Secciones del formulario */}
          {informacionPersonal}
          {datosNacimiento}
          {datosParto}
          {personalMedico}
          {vacunacionPesquisa}
          
          {/* Botones de acción */}
          <div className="flex justify-end mt-8 space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
            >
              <Save className="mr-2" size={18} />
              {saving ? 'Guardando...' : 'Guardar Paciente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPaciente;
