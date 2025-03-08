
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
          <title>Certificado de Nacimiento - ${paciente.nombre} ${paciente.apellido}</title>
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
            
            <div className="print-container" ref={documentRef}>
              <div className="documento">
                <div className="header">
                  <div className="titulo">CERTIFICADO DE NACIMIENTO</div>
                  <div className="subtitulo">Documento oficial de registro de nacimiento</div>
                </div>
                
                <div className="seccion">
                  <div className="seccion-titulo">INFORMACIÓN DEL RECIÉN NACIDO</div>
                  <div className="fila">
                    <span className="etiqueta">Nombre completo:</span>
                    <span className="valor">{paciente.nombre} {paciente.apellido}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Fecha de nacimiento:</span>
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
                
                <div className="seccion">
                  <div className="seccion-titulo">MEDIDAS ANTROPOMÉTRICAS</div>
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
                
                <div className="seccion">
                  <div className="seccion-titulo">DATOS DEL NACIMIENTO</div>
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
                
                <div className="seccion">
                  <div className="seccion-titulo">VACUNACIÓN</div>
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
                
                <div className="seccion">
                  <div className="seccion-titulo">DATOS CLÍNICOS</div>
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
                
                {(paciente.fechaEgreso || paciente.pesoEgreso) && (
                  <div className="seccion">
                    <div className="seccion-titulo">DATOS DE EGRESO</div>
                    <div className="fila">
                      <span className="etiqueta">Fecha de egreso:</span>
                      <span className="valor">{formatDate(paciente.fechaEgreso) || 'No especificada'}</span>
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
                    <div className="fila">
                      <span className="etiqueta">Enfermera:</span>
                      <span className="valor">{paciente.enfermeraEgreso || 'No especificada'}</span>
                    </div>
                    <div className="fila">
                      <span className="etiqueta">Neonatólogo/a:</span>
                      <span className="valor">{paciente.neonatologoEgreso || 'No especificado'}</span>
                    </div>
                  </div>
                )}
                
                <div className="seccion">
                  <div className="seccion-titulo">EQUIPO MÉDICO</div>
                  <div className="fila">
                    <span className="etiqueta">Obstetra:</span>
                    <span className="valor">{paciente.obstetra || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Neonatólogo:</span>
                    <span className="valor">{paciente.neonatologo || 'No especificado'}</span>
                  </div>
                  <div className="fila">
                    <span className="etiqueta">Enfermera:</span>
                    <span className="valor">{paciente.enfermera || 'No especificado'}</span>
                  </div>
                </div>
                
                <div className="pie-pagina">
                  <p>Este documento es un certificado oficial de nacimiento. Fecha de emisión: {new Date().toLocaleDateString()}</p>
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
