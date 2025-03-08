
const DB_NAME = 'ClinicaDB';
const DB_VERSION = 1;
const STORE_NAME = 'pacientes';

interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  horaNacimiento: string;
  numeroHistoriaClinica: string;
  sexo: string;
  peso: string;
  talla: string;
  perimetroCefalico: string;
  edadGestacional: string;
  apgar: string;
  ddv: string;
  hc: string;
  pulsera: string;
  nacidoPor: string;
  presentacion: string;
  liquidoAmniotico: string;
  rupturaMembranas: string;
  clasificacion: string;
  procedencia: string;
  sectorInternacion: string;
  obstetra: string;
  enfermera: string;
  neonatologo: string;
  vacunacionHbsag: boolean;
  vacunacionBcg: boolean;
  pesquisaMetabolica: boolean;
  grupoFactor: string;
  laboratorios: string;
  datosMaternos: string;
  sarsCov2: string;
  chagas: string;
  toxoplasmosis: string;
  hiv: string;
  vdrl: string;
  hepatitisB: string;
  egb: string;
  createdAt: number;
}

class DBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('nombreApellido', ['nombre', 'apellido'], { unique: false });
          store.createIndex('numeroHistoriaClinica', 'numeroHistoriaClinica', { unique: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('Base de datos inicializada correctamente');
        resolve(true);
      };

      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', (event.target as IDBOpenDBRequest).error);
        reject(false);
      };
    });
  }

  async agregarPaciente(paciente: Omit<Paciente, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const nuevoPaciente: Omit<Paciente, 'id'> = {
        ...paciente,
        createdAt: Date.now()
      };
      
      const request = store.add(nuevoPaciente);
      
      request.onsuccess = (event) => {
        const id = (event.target as IDBRequest<number>).result;
        resolve(id);
      };
      
      request.onerror = (event) => {
        console.error('Error al agregar paciente:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async buscarPacientesPorNombre(query: string): Promise<Paciente[]> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();
      const resultados: Paciente[] = [];
      
      query = query.toLowerCase().trim();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          const paciente = cursor.value as Paciente;
          const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
          
          if (query === '' || nombreCompleto.includes(query) || 
              paciente.numeroHistoriaClinica.toLowerCase().includes(query)) {
            resultados.push(paciente);
          }
          
          cursor.continue();
        } else {
          resolve(resultados);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error al buscar pacientes:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async obtenerPacientePorId(id: number): Promise<Paciente | null> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = (event) => {
        const paciente = (event.target as IDBRequest<Paciente>).result;
        resolve(paciente || null);
      };
      
      request.onerror = (event) => {
        console.error('Error al obtener paciente:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async actualizarPaciente(paciente: Paciente): Promise<boolean> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(paciente);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error al actualizar paciente:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

// Singleton para asegurar una sola instancia de la base de datos
const dbService = new DBService();
export { dbService, type Paciente };
