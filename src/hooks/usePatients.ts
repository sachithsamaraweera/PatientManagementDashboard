import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'patients'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const patientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patient[];
        setPatients(patientsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const sanitizePatientData = (data: Omit<Patient, 'id'>): DocumentData => {
    // Remove undefined values to prevent Firebase errors
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as DocumentData);
  };

  const addPatient = async (newPatient: Omit<Patient, 'id'>) => {
    try {
      const sanitizedData = sanitizePatientData(newPatient);
      await addDoc(collection(db, 'patients'), sanitizedData);
    } catch (error) {
      console.error('Error adding patient:', error);
      throw new Error('Failed to add patient');
    }
  };

  const updatePatient = async (id: string, updatedPatient: Omit<Patient, 'id'>) => {
    try {
      const sanitizedData = sanitizePatientData(updatedPatient);
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, sanitizedData);
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const patientRef = doc(db, 'patients', id);
      await deleteDoc(patientRef);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }
  };

  return {
    patients,
    loading,
    error,
    addPatient,
    updatePatient,
    deletePatient
  };
}