
import React, { useRef } from 'react';
import { Paciente } from '../services/db';
import { formatDate } from '../utils/dateUtils';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

interface DocumentoImprimibleProps {
  paciente: Paciente;
  onClose: () => void;
}

const DocumentoImprimible: React.FC<DocumentoImprimibleProps> = ({ 
  paciente, 
  onClose 
}) => {
  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = documentRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <html>
        <head>
          <title>EPICRISIS NEONATAL - ${paciente.nombre} ${paciente.apellido}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .documento { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .titulo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitulo { font-size: 16px; margin-bottom: 20px; }
            .seccion { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .seccion-titulo { font-weight: bold; margin-bottom: 10px; }
            .fila { display: flex; margin-bottom: 8px; }
            .etiqueta { font-weight: bold; min-width: 200px; }
            .valor { flex: 1; }
            .pie-pagina { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print {
              body { margin: 0; padding: 15mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    // Recargar la página después de imprimir para restaurar todo el estado
    window.location.reload();
  };

  const calcularPorcentajeDiferenciaPeso = () => {
    if (!paciente?.peso || !paciente?.pesoEgreso) return '-';
    
    try {
      const pesoNacimiento = parseFloat(paciente.peso);
      const pesoEgreso = parseFloat(paciente.pesoEgreso);
      
      if (isNaN(pesoNacimiento) || isNaN(pesoEgreso) || pesoNacimiento === 0) {
        return 'Error en cálculo';
      }
      
      const porcentaje = ((pesoEgreso * 100) / pesoNacimiento) - 100;
      return porcentaje.toFixed(2) + '%';
    } catch (e) {
      return 'Error en cálculo';
    }
  };

  return (
    <>
     
     <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50">
    <div className="p-6">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documento para imprimir</h2>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="bg-medical-600 hover:bg-medical-700">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>

      <div className="print:shadow-none print:p-0" ref={documentRef}>
        <div className="border-b pb-6 mb-6 print:border-none">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">EPICRISIS NEONATAL</h2>
            <p className="text-gray-600 dark:text-blue-600 mt-2">SANATORIO SAN FRANCISCO DE ASÍS</p>
          </div>

          {/* Sección de datos del recién nacido */}
          <div className="seccion-titulo mb-4 text-xs font-bold">DATOS DEL RECIÉN NACIDO</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            <div className="fila flex items-center">
              <span className="etiqueta text-xs font-medium">Nombre completo:</span>
              <span className="valor text-xs ml-1">{paciente.nombre} {paciente.apellido}</span>
            </div>
            <div className="fila flex items-center">
              <span className="etiqueta text-xs font-medium">Fecha y hora de nacimiento:</span>
              <span className="valor text-xs ml-1">{formatDate(paciente.fechaNacimiento)} - {paciente.horaNacimiento} hs</span>
            </div>
            <div className="fila flex items-center">
              <span className="etiqueta text-xs font-medium">Sexo:</span>
              <span className="valor text-xs ml-1">
                {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : paciente.sexo || 'No especificado'}
              </span>
            </div>
            <div className="fila flex items-center">
              <span className="etiqueta text-xs font-medium">N° Historia Clínica:</span>
              <span className="valor text-xs ml-1">{paciente.numeroHistoriaClinica}</span>
            </div>
          </div>

          {/* Sección de medidas antropométricas */}
          <div className="seccion mt-4">
            <div className="seccion-titulo mb-4 text-xs font-bold">MEDIDAS ANTROPOMÉTRICAS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Peso:</span>
                <span className="valor text-xs ml-1">{paciente.peso} gramos</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Talla:</span>
                <span className="valor text-xs ml-1">{paciente.talla} cm</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Perímetro cefálico:</span>
                <span className="valor text-xs ml-1">{paciente.perimetroCefalico} cm</span>
              </div>
            </div>
          </div>

          {/* Sección de datos del parto */}
          <div className="seccion mt-4">
            <div className="seccion-titulo text-xs font-bold">DATOS DEL PARTO</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Edad gestacional:</span>
                <span className="valor text-xs ml-1">{paciente.edadGestacional}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">APGAR:</span>
                <span className="valor text-xs ml-1">{paciente.apgar}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Nacido por:</span>
                <span className="valor text-xs ml-1">{paciente.nacidoPor || 'No especificado'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Presentación:</span>
                <span className="valor text-xs ml-1">{paciente.presentacion || 'No especificada'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Líquido amniótico:</span>
                <span className="valor text-xs ml-1">{paciente.liquidoAmniotico || 'No especificado'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Clasificación:</span>
                <span className="valor text-xs ml-1">{paciente.clasificacion || 'No especificada'}</span>
              </div>
            </div>
          </div>

          {/* Sección de vacunación */}
          <div className="seccion mt-4">
            <div className="seccion-titulo text-xs font-bold">VACUNACIÓN</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Vacunación HBsAg:</span>
                <span className="valor text-xs ml-1">{paciente.vacunacionHbsag ? 'Sí' : 'No'}</span>
              </div>
              {paciente.vacunacionHbsag && (
                <>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Lote HBsAg:</span>
                    <span className="valor text-xs ml-1">{paciente.loteHbsag || 'No especificado'}</span>
                  </div>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Fecha HBsAg:</span>
                    <span className="valor text-xs ml-1">{formatDate(paciente.fechaHbsag) || 'No especificada'}</span>
                  </div>
                </>
              )}
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Vacunación BCG:</span>
                <span className="valor text-xs ml-1">{paciente.vacunacionBcg ? 'Sí' : 'No'}</span>
              </div>
              {paciente.vacunacionBcg && (
                <>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Lote BCG:</span>
                    <span className="valor text-xs ml-1">{paciente.loteBcg || 'No especificado'}</span>
                  </div>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Fecha BCG:</span>
                    <span className="valor text-xs ml-1">{formatDate(paciente.fechaBcg) || 'No especificada'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sección de pesquisa neonatal */}
          <div className="seccion mt-4">
            <div className="seccion-titulo text-xs font-bold">PESQUISA NEONATAL</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Pesquisa metabólica:</span>
                <span className="valor text-xs ml-1">{paciente.pesquisaMetabolica ? 'Sí' : 'No'}</span>
              </div>
              {paciente.pesquisaMetabolica && (
                <>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Protocolo:</span>
                    <span className="valor text-xs ml-1">{paciente.protocoloPesquisa || 'No especificado'}</span>
                  </div>
                  <div className="fila flex items-center">
                    <span className="etiqueta text-xs font-medium">Fecha y hora:</span>
                    <span className="valor text-xs ml-1">
                      {formatDate(paciente.fechaPesquisa) || 'No especificada'} {paciente.horaPesquisa || ''}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sección de laboratorios */}
          <div className="seccion mt-4">
            <div className="seccion-titulo text-xs font-bold">LABORATORIOS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Grupo y factor RN:</span>
                <span className="valor text-xs ml-1">{paciente.grupoFactorRn || 'No especificado'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Grupo y factor materno:</span>
                <span className="valor text-xs ml-1">{paciente.grupoFactorMaterno || 'No especificado'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">PCD:</span>
                <span className="valor text-xs ml-1">{paciente.pcd || 'No especificado'}</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Bilirrubina Total:</span>
                <span className="valor text-xs ml-1">{paciente.bilirrubinaTotalValor || 'No especificado'} mg/dl</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Bilirrubina Directa:</span>
                <span className="valor text-xs ml-1">{paciente.bilirrubinaDirectaValor || 'No especificado'} mg/dl</span>
              </div>
              <div className="fila flex items-center">
                <span className="etiqueta text-xs font-medium">Hematocrito:</span>
                <span className="valor text-xs ml-1">{paciente.hematocritoValor || 'No especificado'} %</span>
              </div>
            </div>
          </div>

          {/* Sección de datos del egreso */}
          {(paciente.fechaEgreso || paciente.pesoEgreso) && (
            <div className="seccion mt-4">
              <div className="seccion-titulo text-xs font-bold">DATOS DEL EGRESO</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Fecha de egreso:</span>
                  <span className="valor text-xs ml-1">{formatDate(paciente.fechaEgreso) || 'No especificada'}</span>
                </div>
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Días de vida:</span>
                  <span className="valor text-xs ml-1">{paciente.ddv || 'No especificados'}</span>
                </div>
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Hora de egreso:</span>
                  <span className="valor text-xs ml-1">{paciente.horaEgreso || 'No especificada'}</span>
                </div>
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Peso de egreso:</span>
                  <span className="valor text-xs ml-1">{paciente.pesoEgreso || 'No especificado'} g</span>
                </div>
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">% diferencia peso:</span>
                  <span className="valor text-xs ml-1">{calcularPorcentajeDiferenciaPeso()}</span>
                </div>
              </div>

              {/* Sección de evolución */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold">Evolución durante la internación</h3>
                <p className="text-xs text-gray-700 dark:text-white">{paciente.evolucionInternacion || 'No especificado'}</p>
              </div>

              {/* Sección de diagnósticos */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold">Diagnósticos</h3>
                <p className="text-xs text-gray-700 dark:text-white">{paciente.diagnosticos || 'No especificado'}</p>
              </div>

              {/* Sección de indicaciones al egreso */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold">Indicaciones al egreso</h3>
                <p className="text-xs text-gray-700 dark:text-white">{paciente.indicacionesEgreso || 'No especificado'}</p>
              </div>

              {/* Sección de observaciones */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold">Observaciones</h3>
                <p className="text-xs text-gray-700 dark:text-white">{paciente.observaciones || 'No especificado'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Enfermera/o:</span>
                  <span className="valor text-xs ml-1">{paciente.enfermeraEgreso || 'No especificada'}</span>
                </div>
                <div className="fila flex items-center">
                  <span className="etiqueta text-xs font-medium">Neonatólogo/a:</span>
                  <span className="valor text-xs ml-1">{paciente.neonatologoEgreso || 'No especificado'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pie de página */}
          <div className="pie-pagina bg-white pt-6 rounded-lg shadow-md space-y-4 dark:bg-gray-800 text-white">
            <p className="text-xs text-gray-700 dark:text-white">
              Realizar consulta ambulatoria por consultorios externos para seguimiento del recién nacido dentro de los 7 (siete) días de producido el egreso sanatorial. 
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
            </p>
            <p className="text-xs text-gray-700 dark:text-white">
              A fin de dar cumplimiento a lo estipulado en el ART 4 INC.D del D.R. N° 208/01 de la Ley básica de salud N° 153/99, a pedido del paciente, familiar, representante legal, se hace entrega en este acto de copia de Epicrisis de historia clínica del RN. 
              <span className="font-semibold">{new Date().toLocaleDateString()}</span>
            </p>
            <p className="text-xs text-gray-700 dark:text-white font-semibold">RECIBÍ CONFORME</p>
            <div className='flex justify-between'>
              <div className="space-y-6">
                <p className="text-xs text-gray-700 dark:text-white">FIRMA: _______________________________</p>
                <p className="text-xs text-gray-700 dark:text-white">ACLARACIÓN: __________________________</p>
                <p className="text-xs text-gray-700 dark:text-white">DNI: _________________________________</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-700 dark:text-white">PROFESIONAL ACTUANTE: ________________</p>
                <p className="text-xs text-gray-700 dark:text-white">FIRMA Y SELLO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default DocumentoImprimible;
