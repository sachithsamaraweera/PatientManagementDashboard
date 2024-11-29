import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Patient } from './types';
import { StatCard } from './components/StatCard';
import { PatientForm } from './components/PatientForm';
import { usePatients } from './hooks/usePatients';

function App() {
  const { patients, loading, error, addPatient, updatePatient, deletePatient } = usePatients();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  const stats = {
    total: patients.length,
    new: patients.filter(p => {
      const admissionDate = new Date(p.admissionDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return admissionDate >= weekAgo;
    }).length,
    discharged: patients.filter(p => p.status === 'Discharged').length,
  };

  const handleAddPatient = async (newPatient: Omit<Patient, 'id'>) => {
    try {
      await addPatient(newPatient);
      setIsFormOpen(false);
    } catch (error) {
      alert('Failed to add patient');
    }
  };

  const handleEditPatient = async (updatedPatient: Omit<Patient, 'id'>) => {
    if (!editingPatient) return;
    try {
      await updatePatient(editingPatient.id, updatedPatient);
      setEditingPatient(undefined);
    } catch (error) {
      alert('Failed to update patient');
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
      } catch (error) {
        alert('Failed to delete patient');
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Management Dashboard</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Patient
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.total}
            icon={Users}
            color="bg-blue-600"
          />
          <StatCard
            title="New Patients (7 days)"
            value={stats.new}
            icon={UserPlus}
            color="bg-green-600"
          />
          <StatCard
            title="Discharged Patients"
            value={stats.discharged}
            icon={UserCheck}
            color="bg-purple-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.conditionCategory}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{patient.condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.locationType === 'Ward' 
                          ? `${patient.wardName} - ${patient.bedNumber}`
                          : `Clinic ${patient.clinicNumber}`
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setEditingPatient(patient)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {(isFormOpen || editingPatient) && (
          <PatientForm
            onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
            onClose={() => {
              setIsFormOpen(false);
              setEditingPatient(undefined);
            }}
            initialData={editingPatient}
          />
        )}
      </div>
    </div>
  );
}

export default App;