import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage';
import { Project, ProjectFormData } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initFirebase() {
  if (typeof window === 'undefined') return false;
  if (!firebaseConfig.apiKey) return false;
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    return true;
  } catch {
    return false;
  }
}

function getAuthInstance(): Auth {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase Auth not initialized. Set up your environment variables.');
  return auth;
}

function getDbInstance(): Firestore {
  if (!db) initFirebase();
  if (!db) throw new Error('Firebase Firestore not initialized. Set up your environment variables.');
  return db;
}

function getStorageInstance(): FirebaseStorage {
  if (!storage) initFirebase();
  if (!storage) throw new Error('Firebase Storage not initialized. Set up your environment variables.');
  return storage;
}

// Auth functions
export async function loginAdmin(email: string, password: string): Promise<User> {
  const authInstance = getAuthInstance();
  const result = await signInWithEmailAndPassword(authInstance, email, password);
  return result.user;
}

export async function logoutAdmin(): Promise<void> {
  const authInstance = getAuthInstance();
  await signOut(authInstance);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  try {
    const authInstance = getAuthInstance();
    return onAuthStateChanged(authInstance, callback);
  } catch {
    // Firebase not configured — resolve immediately with no user
    callback(null);
    return () => {};
  }
}

// Firestore functions
export async function getProjects(): Promise<Project[]> {
  const dbInstance = getDbInstance();
  const q = query(collection(dbInstance, 'projects'), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Project;
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const dbInstance = getDbInstance();
  const docRef = doc(dbInstance, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Project;
}

export async function addProject(data: ProjectFormData): Promise<string> {
  const dbInstance = getDbInstance();
  const docRef = await addDoc(collection(dbInstance, 'projects'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
  const dbInstance = getDbInstance();
  await updateDoc(doc(dbInstance, 'projects', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  const dbInstance = getDbInstance();
  await deleteDoc(doc(dbInstance, 'projects', id));
}

// Storage functions
export async function uploadImage(file: File, path: string): Promise<string> {
  const storageInstance = getStorageInstance();
  const storageRef = ref(storageInstance, `images/${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function uploadVideo(file: File, path: string): Promise<string> {
  const storageInstance = getStorageInstance();
  const storageRef = ref(storageInstance, `videos/${path}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteFile(url: string): Promise<void> {
  const storageInstance = getStorageInstance();
  const fileRef = ref(storageInstance, url);
  await deleteObject(fileRef);
}

// Demo data for development without Firebase
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    title: 'SmartInvoice - Invoice Management System',
    summary:
      'A comprehensive invoice management system with automated billing, multi-currency support, tax calculations, and real-time payment tracking for businesses of all sizes.',
    description:
      'Built a full-featured invoice management system that streamlines the entire billing workflow from invoice creation to payment reconciliation. The system supports recurring invoices, automated reminders, multi-currency transactions, and integrates with major payment gateways. Features a Flutter mobile app for on-the-go invoice management and a web dashboard for detailed analytics.',
    technologies: [
      'Flutter',
      'Dart',
      'Node.js',
      'PostgreSQL',
      'Firebase',
      'Stripe',
      'Docker',
    ],
    features: [
      'Automated invoice generation with customizable templates',
      'Multi-currency support with real-time exchange rates',
      'Recurring billing and subscription management',
      'Payment gateway integration (Stripe, PayPal)',
      'Automated payment reminders and follow-ups',
      'Real-time payment tracking and reconciliation',
    ],
    challenges: [
      'Handling complex tax calculations across different jurisdictions',
      'Ensuring data consistency across mobile and web platforms',
      'Building a reliable recurring billing scheduler',
    ],
    solutions: [
      'Implemented a pluggable tax engine with jurisdiction-specific rules',
      'Used Firebase Firestore real-time sync with offline persistence',
      'Built a distributed task scheduler with retry logic and notifications',
    ],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: 'https://github.com/yourusername/invoice-system',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'QuickPOS - Point of Sale Billing App',
    summary:
      'A high-performance POS billing application designed for retail stores and restaurants with offline-first architecture, inventory management, and detailed sales analytics.',
    description:
      'Developed a robust point-of-sale application that handles high-volume transactions with offline-first reliability. The app features barcode scanning, split payments, multiple tax rates, and real-time inventory tracking. Built with Flutter for cross-platform deployment on Android tablets and iOS devices, with a cloud backend for centralized management.',
    technologies: [
      'Flutter',
      'Dart',
      'Firebase',
      'Node.js',
      'MongoDB',
      'Thermal Printer',
    ],
    features: [
      'Offline-first architecture with automatic sync when online',
      'Barcode and QR code scanning for quick product lookup',
      'Split payments across multiple methods (cash, card, UPI)',
      'Real-time inventory management with low-stock alerts',
      'Thermal receipt printing with customizable templates',
      'Sales analytics dashboard with export capabilities',
    ],
    challenges: [
      'Ensuring reliable offline data sync with conflict resolution',
      'Optimizing thermal printer integration across different Android devices',
      'Handling high-volume transaction processing without lag',
    ],
    solutions: [
      'Implemented CRDT-based conflict resolution for offline data sync',
      'Created a hardware abstraction layer for thermal printer compatibility',
      'Used local SQLite database with efficient indexing for fast queries',
    ],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: 'https://github.com/yourusername/pos-billing',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'PDFGen - PDF Invoice Generator Engine',
    summary:
      'A scalable PDF generation engine for creating professional invoices, receipts, and business documents with customizable templates and batch processing.',
    description:
      'Created a high-performance PDF generation service that produces pixel-perfect invoices and business documents. The engine supports custom branding, multi-language invoices, digital signatures, and batch processing for mass document generation. Integrated as a REST API that can be consumed by any frontend application, with a Flutter SDK for mobile integration.',
    technologies: [
      'Dart',
      'Flutter',
      'Node.js',
      'PDFKit',
      'Redis',
      'AWS Lambda',
      'S3',
    ],
    features: [
      'Template-based PDF generation with custom branding',
      'Multi-language and multi-currency invoice support',
      'Digital signature and QR code integration',
      'Batch processing for mass document generation',
      'RESTful API with Flutter SDK for mobile apps',
      'Cloud storage integration (AWS S3, Firebase Storage)',
    ],
    challenges: [
      'Achieving pixel-perfect PDF rendering across different languages',
      'Optimizing batch generation performance for hundreds of documents',
      'Managing memory efficiently for large document processing',
    ],
    solutions: [
      'Used a layout engine with precise coordinate-based rendering',
      'Implemented parallel processing with worker threads and Redis queues',
      'Applied stream-based processing to avoid loading all documents in memory',
    ],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: 'https://github.com/yourusername/pdf-invoice-generator',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'ThermalPrint SDK - Printer Integration Library',
    summary:
      'A cross-platform SDK for integrating thermal printers with mobile and desktop applications, supporting ESC/POS commands, Bluetooth, USB, and network printing.',
    description:
      'Developed a comprehensive thermal printer SDK that abstracts the complexity of thermal printer communication across different platforms. The library supports ESC/POS command generation, Bluetooth Classic, USB (OTG), and WiFi network printing. Includes a Flutter plugin, REST API wrapper, and a template designer for creating custom receipt layouts without writing code.',
    technologies: [
      'Flutter',
      'Dart',
      'Kotlin',
      'Swift',
      'ESC/POS',
      'Bluetooth',
      'USB',
    ],
    features: [
      'Cross-platform support (Android, iOS, Windows, Linux)',
      'ESC/POS command builder with preview mode',
      'Multiple connectivity options (Bluetooth, USB, WiFi, Ethernet)',
      'Visual receipt template designer',
      'Barcode, QR code, and image printing support',
      'Auto-detection and configuration of printer models',
    ],
    challenges: [
      'Handling fragmentation across hundreds of thermal printer models',
      'Managing Bluetooth connection stability across Android versions',
      'Achieving consistent print quality across different paper sizes',
    ],
    solutions: [
      'Built a device profile database with model-specific configurations',
      'Implemented automatic reconnection with exponential backoff strategy',
      'Created a rendering engine that auto-scales content to paper dimensions',
    ],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: 'https://github.com/yourusername/thermal-printer-sdk',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Flutter Business Suite',
    summary:
      'A collection of cross-platform Flutter business applications including inventory management, expense tracking, customer relationship management, and analytics dashboards.',
    description:
      'Built a comprehensive suite of business applications using Flutter and Dart, designed to help small and medium businesses digitize their operations. The suite includes an inventory management system, expense tracker with receipt scanning, CRM for customer management, and a centralized analytics dashboard. All apps share a common design system and backend infrastructure, enabling seamless data integration across modules.',
    technologies: [
      'Flutter',
      'Dart',
      'Firebase',
      'Node.js',
      'PostgreSQL',
      'Redis',
      'Docker',
    ],
    features: [
      'Shared authentication and user management across all apps',
      'Inventory management with barcode scanning and stock alerts',
      'Expense tracking with OCR receipt scanning',
      'Customer relationship management with interaction history',
      'Unified analytics dashboard with real-time KPIs',
      'Offline-first architecture with automatic background sync',
    ],
    challenges: [
      'Designing a scalable shared backend for multiple application modules',
      'Maintaining consistent UI/UX across different business applications',
      'Implementing efficient cross-module data aggregation for analytics',
    ],
    solutions: [
      'Adopted a microservices architecture with API gateway for unified access',
      'Created a shared Flutter component library with theming support',
      'Built a data warehouse with scheduled ETL pipelines for analytics',
    ],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: 'https://github.com/yourusername/flutter-business-suite',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
