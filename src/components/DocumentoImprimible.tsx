
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Documento para imprimir</h2>
              <div className="flex gap-2">
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">EPICRISIS NEONATAL</h2>
                <p className="text-gray-600 dark:text-blue-600 mt-2">SANATORIO SAN FRANCISCO DE ASÍS</p>
                </div>
                
                  <div className="seccion-titulo mb-4">DATOS DEL RECIÉN NACIDO</div>
                  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1 ">
                  <div className="fila">
                    <span className="etiqueta">Nombre completo:</span>
                    <span className="valor">{paciente.nombre} {paciente.apellido}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Fecha y horade nacimiento:</span>
                    <span className="valor">{formatDate(paciente.fechaNacimiento)} - {paciente.horaNacimiento} hs</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Sexo:</span>
                    <span className="valor">
                      {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : paciente.sexo || 'No especificado'}
                    </span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">N° Historia Clínica:</span>
                    <span className="valor">{paciente.numeroHistoriaClinica}</span>
                  </div>
                </div>
                
                <div className="seccion mt-4">
                  <div className="seccion-titulo mb-4">MEDIDAS ANTROPOMÉTRICAS</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-1 ">
                  <div className="fila">
                    <span className="etiqueta">Peso:</span>
                    <span className="valor">{paciente.peso} gramos</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Talla:</span>
                    <span className="valor">{paciente.talla} cm</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Perímetro cefálico:</span>
                    <span className="valor">{paciente.perimetroCefalico} cm</span>
                  </div>
                </div>
                </div>
                
                <div className="seccion mt-4">
                  <div className="seccion-titulo">DATOS DEL PARTO</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 ">
                  <div className="fila">
                    <span className="etiqueta">Edad gestacional:</span>
                    <span className="valor">{paciente.edadGestacional}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">APGAR:</span>
                    <span className="valor">{paciente.apgar}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Nacido por:</span>
                    <span className="valor">{paciente.nacidoPor || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Presentación:</span>
                    <span className="valor">{paciente.presentacion || 'No especificada'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Líquido amniótico:</span>
                    <span className="valor">{paciente.liquidoAmniotico || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Clasificación:</span>
                    <span className="valor">{paciente.clasificacion || 'No especificada'}</span>
                  </div>
                </div>
                </div>
                
                <div className="seccion mt-4">
                  <div className="seccion-titulo">VACUNACIÓN</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2 ">
                  <div className="fila">
                    <span className="etiqueta">Vacunación HBsAg:</span>
                    <span className="valor">{paciente.vacunacionHbsag ? 'Sí' : 'No'}</span>
                  </div>
                  {paciente.vacunacionHbsag && (
                    <>
                      <div className="fila">
                        <span className="etiqueta">Lote HBsAg:</span>
                        <span className="valor">{paciente.loteHbsag || 'No especificado'}</span>
                      </div>
                      <div className="fila">
                        <span className="etiqueta">Fecha HBsAg:</span>
                        <span className="valor">{formatDate(paciente.fechaHbsag) || 'No especificada'}</span>
                      </div>
                    </>
                  )}
                  <div className="fila">
                    <span className="etiqueta">Vacunación BCG:</span>
                    <span className="valor">{paciente.vacunacionBcg ? 'Sí' : 'No'}</span>
                  </div>
                  {paciente.vacunacionBcg && (
                    <>
                      <div className="fila">
                        <span className="etiqueta">Lote BCG:</span>
                        <span className="valor">{paciente.loteBcg || 'No especificado'}</span>
                      </div>
                      <div className="fila">
                        <span className="etiqueta">Fecha BCG:</span>
                        <span className="valor">{formatDate(paciente.fechaBcg) || 'No especificada'}</span>
                      </div>
                    </>
                  )}
                  </div>
                  </div>
                  <div className="seccion">
                  <div className="seccion-titulo">PESQUISA NEONATAL</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 ">
                  <div className="fila">
                    <span className="etiqueta">Pesquisa metabólica:</span>
                    <span className="valor">{paciente.pesquisaMetabolica ? 'Sí' : 'No'}</span>
                  </div>
                  {paciente.pesquisaMetabolica && (
                    <>
                      <div className="fila">
                        <span className="etiqueta">Protocolo:</span>
                        <span className="valor">{paciente.protocoloPesquisa || 'No especificado'}</span>
                      </div>
                      <div className="fila">
                        <span className="etiqueta">Fecha y hora:</span>
                        <span className="valor">
                          {formatDate(paciente.fechaPesquisa) || 'No especificada'} {paciente.horaPesquisa || ''}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                </div>
                
                <div className="seccion mt-4">
                  <div className="seccion-titulo">LABORATORIOS</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2 ">
                  <div className="fila">
                    <span className="etiqueta">Grupo y factor RN:</span>
                    <span className="valor">{paciente.grupoFactorRn || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Grupo y factor materno:</span>
                    <span className="valor">{paciente.grupoFactorMaterno || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">PCD:</span>
                    <span className="valor">{paciente.pcd || 'No especificado'}</span>
                  </div>
                  
                  <div className="fila">
                    <span className="etiqueta">Bilirrubina Total:</span>
                    <span className="valor">{paciente.bilirrubinaTotalValor || 'No especificado'} mg/dl</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Bilirrubina Directa:</span>
                    <span className="valor">{paciente.bilirrubinaDirectaValor || 'No especificado'} mg/dl</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Hematocrito:</span>
                    <span className="valor">{paciente.hematocritoValor || 'No especificado'} %</span>
                  </div>
                </div>
                </div>
                
                {(paciente.fechaEgreso || paciente.pesoEgreso) && (
                  <div className="seccion mt-4">
                    <div className="seccion-titulo">DATOS DEL EGRESO</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-2 ">
                    <div className="fila">
                      <span className="etiqueta">Fecha de egreso:</span>
                      <span className="valor">{formatDate(paciente.fechaEgreso) || 'No especificada'}</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">Días de vida:</span>
                      <span className="valor">{paciente.ddv || 'No especificados'}</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">Hora de egreso:</span>
                      <span className="valor">{paciente.horaEgreso || 'No especificada'}</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">Peso de egreso:</span>
                      <span className="valor">{paciente.pesoEgreso || 'No especificado'} g</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">% diferencia peso:</span>
                      <span className="valor">{calcularPorcentajeDiferenciaPeso()}</span>
                    </div>
                    </div>
                    
                     {/* Sección de Evolución */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Evolución durante la internación</h3>
        <p className="text-gray-700 dark:text-white">{paciente.evolucionInternacion || 'No especificado'}</p>
      </div>

      {/* Sección de Diagnósticos */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Diagnósticos</h3>
        <p className="text-gray-700 dark:text-white">{paciente.diagnosticos || 'No especificado'}</p>
      </div>

      {/* Sección de Indicaciones al egreso */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Indicaciones al egreso</h3>
        <p className="text-gray-700 dark:text-white">{paciente.indicacionesEgreso || 'No especificado'}</p>
      </div>

      {/* Sección de Observaciones */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Observaciones</h3>
        <p className="text-gray-700 dark:text-white">{paciente.observaciones || 'No especificado'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 ">
                    <div className="fila">
                      <span className="etiqueta">Enfermera/o:</span>
                      <span className="valor">{paciente.enfermeraEgreso || 'No especificada'}</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">Neonatólogo/a:</span>
                      <span className="valor">{paciente.neonatologoEgreso || 'No especificado'}</span>
                    </div>
                  </div>
                  </div>
                )}
                
                
                
                <div className="pie-pagina bg-white p-6 rounded-lg shadow-md space-y-4 dark:bg-gray">
  <p className="text-sm text-gray-700">
    Realizar consulta ambulatoria por consultorios externos para seguimiento del recién nacido dentro de los 7 (siete) días de producido el egreso sanatorial. 
    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
  </p>
  
  <p className="text-sm text-gray-700">
    A fin de dar cumplimiento a lo estipulado en el ART 4 INC.D del D.R. N° 208/01 de la Ley básica de salud N° 153/99, a pedido del paciente, familiar, representante legal, se hace entrega en este acto de copia de Epicrisis de historia clínica del RN. 
    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
  </p>
  
  <p className="text-sm text-gray-700 font-semibold">RECIBÍ CONFORME</p>
  
  <div className="space-y-6">
    <p className="text-sm text-gray-700">FIRMA: _______________________________</p>
    <p className="text-sm text-gray-700">ACLARACIÓN: __________________________</p>
    <p className="text-sm text-gray-700">DNI: _________________________________</p>
  </div>
  
  <div className="space-y-2">
    <p className="text-sm text-gray-700">PROFESIONAL ACTUANTE: ________________</p>
    <p className="text-sm text-gray-700">FIRMA Y SELLO</p>
  </div>
  
  <p className="text-sm text-gray-700">
    FECHA: <span className="font-semibold">{new Date().toLocaleDateString()}</span>
  </p>
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
