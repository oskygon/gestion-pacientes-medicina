
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dbService, Paciente } from '../services/db';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const NuevoPaciente = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Paciente, 'id' | 'createdAt'>>({
    nombre: '',
    apellido: '',
    fechaNacimiento: format(new Date(), 'yyyy-MM-dd'),
    horaNacimiento: format(new Date(), 'HH:mm'),
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
    vacunacionBcg: false,
    pesquisaMetabolica: false,
    grupoFactor: '',
    laboratorios: '',
    datosMaternos: '',
    sarsCov2: '',
    chagas: '',
    toxoplasmosis: '',
    hiv: '',
    vdrl: '',
    hepatitisB: '',
    egb: ''
  });

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
      toast.success('Paciente registrado correctamente');
      setTimeout(() => {
        navigate(`/paciente/${id}`);
      }, 1000);
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      toast.error('Error al guardar el paciente');
      setSaving(false);
    }
  };

  // Grupos de campos para mejor organización del formulario
  const informacionPersonal = (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Apellido *</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento *</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hora de Nacimiento</label>
          <input
            type="time"
            name="horaNacimiento"
            value={formData.horaNacimiento}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Número de Historia Clínica *</label>
          <input
            type="text"
            name="numeroHistoriaClinica"
            value={formData.numeroHistoriaClinica}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Sexo</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos de Nacimiento</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Peso (g)</label>
          <input
            type="text"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            placeholder="Ej: 3500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Talla (cm)</label>
          <input
            type="text"
            name="talla"
            value={formData.talla}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            placeholder="Ej: 50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Perímetro Cefálico (cm)</label>
          <input
            type="text"
            name="perimetroCefalico"
            value={formData.perimetroCefalico}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            placeholder="Ej: 34"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Edad Gestacional</label>
          <input
            type="text"
            name="edadGestacional"
            value={formData.edadGestacional}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            placeholder="Ej: 38 sem"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">APGAR</label>
          <input
            type="text"
            name="apgar"
            value={formData.apgar}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
            placeholder="Ej: 9/10"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">DDV</label>
          <input
            type="text"
            name="ddv"
            value={formData.ddv}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">HC</label>
          <input
            type="text"
            name="hc"
            value={formData.hc}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Pulsera</label>
          <input
            type="text"
            name="pulsera"
            value={formData.pulsera}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const datosParto = (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Parto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nacido Por</label>
          <select
            name="nacidoPor"
            value={formData.nacidoPor}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Parto vaginal">Parto vaginal</option>
            <option value="Cesárea">Cesárea</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Presentación</label>
          <select
            name="presentacion"
            value={formData.presentacion}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Cefálica">Cefálica</option>
            <option value="Podálica">Podálica</option>
            <option value="Transversa">Transversa</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Líquido Amniótico</label>
          <select
            name="liquidoAmniotico"
            value={formData.liquidoAmniotico}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Claro">Claro</option>
            <option value="Meconial">Meconial</option>
            <option value="Teñido">Teñido</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Ruptura de Membranas</label>
          <select
            name="rupturaMembranas"
            value={formData.rupturaMembranas}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Espontánea">Espontánea</option>
            <option value="Artificial">Artificial</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Clasificación</label>
          <input
            type="text"
            name="clasificacion"
            value={formData.clasificacion}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Procedencia</label>
          <input
            type="text"
            name="procedencia"
            value={formData.procedencia}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const personalMedico = (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Médico</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Sector de Internación</label>
          <input
            type="text"
            name="sectorInternacion"
            value={formData.sectorInternacion}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Obstetra</label>
          <input
            type="text"
            name="obstetra"
            value={formData.obstetra}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Enfermera</label>
          <input
            type="text"
            name="enfermera"
            value={formData.enfermera}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Neonatólogo/a</label>
          <input
            type="text"
            name="neonatologo"
            value={formData.neonatologo}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const vacunacionPesquisa = (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacunación y Pesquisa</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vacunacionHbsag"
            name="vacunacionHbsag"
            checked={formData.vacunacionHbsag} 
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, vacunacionHbsag: checked === true }))
            }
          />
          <label htmlFor="vacunacionHbsag" className="text-sm font-medium text-gray-700">
            Vacunación HBsAg
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vacunacionBcg"
            name="vacunacionBcg"
            checked={formData.vacunacionBcg} 
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, vacunacionBcg: checked === true }))
            }
          />
          <label htmlFor="vacunacionBcg" className="text-sm font-medium text-gray-700">
            Vacunación BCG
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pesquisaMetabolica"
            name="pesquisaMetabolica"
            checked={formData.pesquisaMetabolica} 
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, pesquisaMetabolica: checked === true }))
            }
          />
          <label htmlFor="pesquisaMetabolica" className="text-sm font-medium text-gray-700">
            Pesquisa Metabólica
          </label>
        </div>
        
        <div className="space-y-2 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Grupo y Factor</label>
          <input
            type="text"
            name="grupoFactor"
            value={formData.grupoFactor}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Laboratorios</label>
          <textarea
            name="laboratorios"
            value={formData.laboratorios}
            onChange={handleChange}
            rows={2}
            className="glass-input w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const datosMaternos = (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Maternos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Datos Maternos Generales</label>
          <textarea
            name="datosMaternos"
            value={formData.datosMaternos}
            onChange={handleChange}
            rows={2}
            className="glass-input w-full rounded-lg"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">SARS-CoV-2 (PCR)</label>
          <select
            name="sarsCov2"
            value={formData.sarsCov2}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Chagas</label>
          <select
            name="chagas"
            value={formData.chagas}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Toxoplasmosis</label>
          <select
            name="toxoplasmosis"
            value={formData.toxoplasmosis}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">HIV</label>
          <select
            name="hiv"
            value={formData.hiv}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">VDRL</label>
          <select
            name="vdrl"
            value={formData.vdrl}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Hepatitis B</label>
          <select
            name="hepatitisB"
            value={formData.hepatitisB}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">EGB</label>
          <select
            name="egb"
            value={formData.egb}
            onChange={handleChange}
            className="glass-input w-full rounded-lg"
          >
            <option value="">Seleccionar...</option>
            <option value="Positivo">Positivo</option>
            <option value="Negativo">Negativo</option>
            <option value="No realizado">No realizado</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <button 
            onClick={handleCancel}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Paciente</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {informacionPersonal}
            
            {datosNacimiento}
            
            {datosParto}
            
            {personalMedico}
            
            {vacunacionPesquisa}
            
            {datosMaternos}

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="px-6"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={saving}
                className="bg-medical-600 hover:bg-medical-700 text-white px-6"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Paciente
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPaciente;
