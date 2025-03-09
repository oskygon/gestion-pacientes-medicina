import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dbService, Paciente } from '../services/db';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays } from 'date-fns';
import DocumentoImprimible from '@/components/DocumentoImprimible';

const NuevoPaciente = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [pacienteRegistrado, setPacienteRegistrado] = useState<Paciente | null>(null);
  const [showDocumento, setShowDocumento] = useState(false);
  const fechaActual = format(new Date(), 'yyyy-MM-dd');
  const horaActual = format(new Date(), 'HH:mm');
  
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
    sarsCov2: '',
    chagas: '',
    toxoplasmosis: '',
    hiv: '',
    vdrl: '',
    hepatitisB: '',
    egb: ''
  });

  useEffect(() => {
    if (formData.fechaNacimiento) {
      const fechaNacimiento = new Date(formData.fechaNacimiento);
      const hoy = new Date();
      const diasDeVida = differenceInDays(hoy, fechaNacimiento);
      
      setFormData(prev => ({ 
        ...prev, 
        ddv: diasDeVida.toString() 
      }));
    }
  }, [formData.fechaNacimiento]);

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

  const informacionPersonal = (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Información Personal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre *</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apellido *</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Nacimiento *</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora de Nacimiento</label>
          <input
            type="time"
            name="horaNacimiento"
            value={formData.horaNacimiento}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Historia Clínica *</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          >
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>
      </div>
    </div>
  );

  const datosNacimiento = (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Datos de Nacimiento</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peso (g)</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Talla (cm)</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perímetro Cefálico (cm)</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edad Gestacional</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">APGAR</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DDV (días de vida)</label>
          <input
            type="text"
            name="ddv"
            value={formData.ddv}
            readOnly
            className="w-full h-12 p-3 text-base rounded-lg bg-gray-100 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HC</label>
          <input
            type="text"
            name="hc"
            value={formData.hc}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pulsera</label>
          <input
            type="text"
            name="pulsera"
            value={formData.pulsera}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
      </div>
    </div>
  );

  const datosParto = (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Datos del Parto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nacido Por</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Presentación</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Líquido Amniótico</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ruptura de Membranas</label>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Clasificación</label>
          <input
            type="text"
            name="clasificacion"
            value={formData.clasificacion}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Procedencia</label>
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Personal Médico</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sector de Internación</label>
          <input
            type="text"
            name="sectorInternacion"
            value={formData.sectorInternacion}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Obstetra</label>
          <input
            type="text"
            name="obstetra"
            value={formData.obstetra}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enfermera</label>
          <input
            type="text"
            name="enfermera"
            value={formData.enfermera}
            onChange={handleChange}
            className="w-full h-12 p-3 text-base rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Neonatólogo/a</label>
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Vacunación y Pesquisa</h3>
      
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
                Vacunación HBsAg
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
                    className="w-full h-10 p-2 text-sm rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                  <input
                    type="date"
                    name="fechaHbsag"
                    value={formData.fechaHbsag}
                    onChange={handleChange}
                    className="w-full h-10 p-2 text-sm rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
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
                Vacunación BCG
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
                    className="w-full h-10 p-2 text-sm rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                  <input
                    type="date"
                    name="fechaBcg"
                    value={formData.fechaBcg}
                    onChange={handleChange}
                    className="w-full h-10 p-2 text-sm rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-medical-300 focus:border-transparent transition-all duration-300 text-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Pesquisa Metabólica</h4>
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
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity

