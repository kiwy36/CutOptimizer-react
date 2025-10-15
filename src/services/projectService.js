import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * 📁 SERVICIO DE PROYECTOS
 * 📍 Maneja todas las operaciones CRUD de proyectos en Firestore
 */
export const projectService = {
  /**
   * ➕ Crear nuevo proyecto
   */
  async createProject(projectData, userId) {
    const project = {
      name: projectData.name || 'Proyecto sin nombre',
      description: projectData.description || '',
      sheetWidth: projectData.sheetWidth || 2440,
      sheetHeight: projectData.sheetHeight || 1220,
      pieces: projectData.pieces || [],
      sheets: projectData.sheets || [],
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, 'projects'), project)
    return { id: docRef.id, ...project }
  },

  /**
   * 📋 Obtener proyectos del usuario
   */
  async getUserProjects(userId) {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  /**
   * 🔍 Obtener proyecto específico
   */
  async getProject(projectId) {
    const docRef = doc(db, 'projects', projectId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Proyecto no encontrado')
    }
  },

  /**
   * ✏️ Actualizar proyecto
   */
  async updateProject(projectId, projectData) {
    const docRef = doc(db, 'projects', projectId)
    await updateDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    })
  },

  /**
   * 🗑️ Eliminar proyecto
   */
  async deleteProject(projectId) {
    await deleteDoc(doc(db, 'projects', projectId))
  }
}