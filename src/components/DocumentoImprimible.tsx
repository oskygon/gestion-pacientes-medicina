
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
            @page { 
              size: A4; 
              margin: 2cm; 
              margin-top: 0;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              font-size: 10px;
              line-height: 1.3;
            }
            .documento { 
              width: 100%;
              max-width: 21cm;
              min-height: 29.7cm;
              padding: 1cm;
              box-sizing: border-box;
            }
            .header { 
              text-align: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
            }
            .titulo { 
              font-size: 20px;
              font-weight: bold;
              margin: 0;
            }
            .subtitulo { 
              font-size: 12px;
              margin: 5px 0;
            }
            .seccion { 
              margin-bottom: 12px;
              page-break-inside: avoid;
            }
            .seccion-titulo { 
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 11px;
              background: #f5f5f5;
              padding: 2px 5px;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 3px 10px;
            }
            .grid-container-3 {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 3px 10px;
            }
            .fila { 
              display: flex;
              margin-bottom: 2px;
              align-items: center;
              white-space: nowrap;
              overflow: hidden;
            }
            .etiqueta { 
              font-weight: bold;
              min-width: 70px;
              font-size: 10px;
            }
            .etiqueta::after {
              content: ":";
              margin-right: 2px;
            }
            .valor { 
              flex: 1;
              font-size: 10px;
              padding-left: 2px;
              white-space: normal;
            }
            .pie-pagina {
              margin-top: 20px;
              font-size: 9px;
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            .firmas {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .firma-linea {
              border-top: 1px solid #000;
              margin-top: 25px;
              padding-top: 5px;
              text-align: center;
            }
            .texto-largo {
              margin: 5px 0;
              font-size: 10px;
              line-height: 1.3;
            }
            .texto-largo strong {
              margin-right: 2px;
            }
            @media print {
              .no-print { display: none; }
              body { margin: 0; padding: 0; }
              /* Ocultar título en el encabezado de la página impresa */
              @page { margin-top: 0; }
              .header { 
                display: block; 
                text-align: center;
                margin: 0 auto 15px auto;
                padding-top: 1cm;
              }
              .titulo {
                font-size: 22px;
              }
              .subtitulo {
                font-size: 14px;
              }
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
    window.location.reload();
  };

  const calcularPorcentajeDiferenciaPeso = () => {
    if (!paciente?.peso || !paciente?.pesoEgreso) return '-';
    try {
      const pesoNacimiento = parseFloat(paciente.peso);
      const pesoEgreso = parseFloat(paciente.pesoEgreso);
      if (isNaN(pesoNacimiento) || isNaN(pesoEgreso) || pesoNacimiento === 0) return 'Error en cálculo';
      const porcentaje = ((pesoEgreso * 100) / pesoNacimiento) - 100;
      return porcentaje.toFixed(2) + '%';
    } catch (e) {
      return 'Error en cálculo';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto z-50" style={{maxWidth: '21cm'}}>
        <div className="p-4">
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b dark:border-slate-800 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vista previa</h2>
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

          <div ref={documentRef} className="documento p-6 bg-white dark:bg-slate-900">
            <div className="header border-b border-gray-300 dark:border-gray-700 pb-4 mb-6 text-center">
              <h1 className="titulo text-2xl font-bold text-center text-gray-900 dark:text-white">EPICRISIS NEONATAL</h1>
              <p className="subtitulo text-base text-center text-gray-600 dark:text-gray-400 mt-2">SANATORIO SAN FRANCISCO DE ASÍS</p>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">DATOS DEL RECIÉN NACIDO</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-2">
                {[
                  { etiqueta: "Nombre", valor: `${paciente.nombre} ${paciente.apellido}` },
                  { etiqueta: "Fecha y Hora de Nacimiento", valor: `${formatDate(paciente.fechaNacimiento)} ${paciente.horaNacimiento} hs` },
                  { etiqueta: "Sexo", valor: paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : paciente.sexo || '-' },
                  { etiqueta: "Historia Clínica", valor: paciente.numeroHistoriaClinica || '-' }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">MEDIDAS ANTROPOMÉTRICAS</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2">
                {[
                  { etiqueta: "Peso", valor: paciente.peso ? `${paciente.peso} g` : '-' },
                  { etiqueta: "Talla", valor: paciente.talla ? `${paciente.talla} cm` : '-' },
                  { etiqueta: "PC", valor: paciente.perimetroCefalico ? `${paciente.perimetroCefalico} cm` : '-' }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">DATOS DEL PARTO</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
                {[
                  { etiqueta: "Edad Gestacional", valor: paciente.edadGestacional ? `${paciente.edadGestacional}` : '-' },
                  { etiqueta: "APGAR", valor: paciente.apgar || '-' },
                  { etiqueta: "Nacido por", valor: paciente.nacidoPor || '-' },
                  { etiqueta: "Presentación", valor: paciente.presentacion || '-' },
                  { etiqueta: "Líquido Amniótico", valor: paciente.liquidoAmniotico || '-' },
                  { etiqueta: "Clasificación del RN", valor: paciente.clasificacion || '-' }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">VACUNACIÓN Y PESQUISA</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2">
                {[
                  { 
                    etiqueta: "HBsAg", 
                    valor: paciente.vacunacionHbsag 
                      ? `${formatDate(paciente.fechaHbsag) || ''} (Lote: ${paciente.loteHbsag || '-'})` 
                      : 'No' 
                  },
                  { 
                    etiqueta: "BCG", 
                    valor: paciente.vacunacionBcg 
                      ? `${formatDate(paciente.fechaBcg) || ''} (Lote: ${paciente.loteBcg || '-'})` 
                      : 'No' 
                  },
                  { 
                    etiqueta: "Pesquisa Metabólica", 
                    valor: paciente.pesquisaMetabolica 
                      ? `${formatDate(paciente.fechaPesquisa) || ''} ${paciente.horaPesquisa || ''} (Protocolo: ${paciente.protocoloPesquisa || '-'})` 
                      : 'No' 
                  }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor || '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">LABORATORIOS</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-2">
                {[
                  { etiqueta: "Grupo y Factor del RN", valor: paciente.grupoFactorRn },
                  { etiqueta: "Grupo y Factor Materno", valor: paciente.grupoFactorMaterno },
                  { etiqueta: "PCD", valor: paciente.pcd },
                  { etiqueta: "Bilirrubina Total", valor: paciente.bilirrubinaTotalValor ? `${paciente.bilirrubinaTotalValor} mg/dl` : '-' },
                  { etiqueta: "Bilirrubina Directa", valor: paciente.bilirrubinaDirectaValor ? `${paciente.bilirrubinaDirectaValor} mg/dl` : '-' },
                  { etiqueta: "Hematocrito", valor: paciente.hematocritoValor ? `${paciente.hematocritoValor}%` : '-' },
                  { etiqueta: "Otros laboratorios", valor: paciente.laboratorios }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor || '-'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">SEROLOGIAS MATERNAS</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-2">
                {[
                  { etiqueta: "SarsCov2 PCR", valor: paciente.sarsCov2, fecha: paciente?.fechaCovid },
                  { etiqueta: "Chagas", valor: paciente.chagas, fecha: paciente?.fechaChagas },
                  { etiqueta: "Toxoplasmosis", valor: paciente.toxoplasmosis, fecha: paciente?.fechaToxo },
                  { etiqueta: "HIV", valor: paciente.hiv, fecha: paciente?.fechaHIV },
                  { etiqueta: "VDRL", valor: paciente.vdrl, fecha: paciente?.fechaVDRL },
                  { etiqueta: "Hepatitis B", valor: paciente.hepatitisB, fecha: paciente?.fechaHB },
                  { etiqueta: "EGB", valor: paciente.egb, fecha: paciente?.fechaEGB },
                  { etiqueta: "Profilaxis ATB", valor: paciente.profilaxisATB, fecha: null }
                ].map(({ etiqueta, valor, fecha }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor || '-'}</span>
                    {fecha && <span className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(fecha)}</span>}
                  </div>
                ))}
              </div>
            </div>

            {(paciente.fechaEgreso || paciente.pesoEgreso) && (
              <div className="seccion mb-6">
                <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">DATOS DEL EGRESO</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2">
                  {[
                    { etiqueta: "Fecha", valor: formatDate(paciente.fechaEgreso) },
                    { etiqueta: "DDV", valor: paciente.ddv || '-' },
                    { etiqueta: "Hora", valor: paciente.horaEgreso || '-' },
                    { etiqueta: "Peso Egreso", valor: `${paciente.pesoEgreso || '-'} g` },
                    { etiqueta: "% descenso", valor: calcularPorcentajeDiferenciaPeso() }
                  ].map(({ etiqueta, valor }, index) => (
                    <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                      <span className="text-gray-800 dark:text-gray-200 text-sm">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="seccion mb-6">
              <div className="seccion-titulo bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold p-2 rounded-t-lg text-sm mb-3">EVOLUCIÓN E INDICACIONES</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-2">
                {[
                  { etiqueta: "Evolución", valor: paciente.evolucionInternacion || '-' },
                  { etiqueta: "Diagnósticos", valor: paciente.diagnosticos || '-' },
                  { etiqueta: "Indicaciones", valor: paciente.indicacionesEgreso || '-' },
                  { etiqueta: "Observaciones", valor: paciente.observaciones || '-' }
                ].map(({ etiqueta, valor }, index) => (
                  <div key={index} className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{etiqueta}</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{valor}</span>
                  </div>
                ))}
              </div>
            </div>

            {(paciente.fechaEgreso || paciente.pesoEgreso) && (
              <div className="seccion mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                  <div className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Enfermera:</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{paciente.enfermeraEgreso || '-'}</span>
                  </div>
                  <div className="flex flex-col items-start border p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm">
                    <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Neonatólogo/a:</span>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{paciente.neonatologoEgreso || '-'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pie-pagina border-t border-gray-300 dark:border-gray-700 pt-4 mt-6">
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                Realizar consulta ambulatoria por consultorios externos para seguimiento del recién nacido dentro de los 7 (siete) días de producido el egreso sanatorial.
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300 text-xs">
                A fin de dar cumplimiento a lo estipulado en el ART 4 INC.D del D.R. N° 208/01 de la Ley básica de salud N° 153/99, a pedido del paciente, familiar, representante legal, se hace entrega en este acto de copia de Epicrisis de historia clínica del RN.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col justify-end border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 h-32 shadow-sm">
                  <div className="flex-grow"></div>
                  <div className="text-center font-semibold border-t border-gray-300 dark:border-gray-700 pt-2 text-gray-800 dark:text-gray-200">Firma del familiar responsable</div>
                  <div className="text-center mt-1 text-gray-600 dark:text-gray-400 text-xs">Aclaración:</div>
                  <div className="text-center text-gray-600 dark:text-gray-400 text-xs">DNI:</div>
                </div>

                <div className="flex flex-col justify-end border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 h-32 shadow-sm">
                  <div className="flex-grow"></div>
                  <div className="text-center font-semibold border-t border-gray-300 dark:border-gray-700 pt-2 text-gray-800 dark:text-gray-200">Firma y sello del profesional</div>
                  <div className="text-center invisible text-xs">Aclaración:</div>
                  <div className="text-center invisible text-xs">DNI:</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentoImprimible;
