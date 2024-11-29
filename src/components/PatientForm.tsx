import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Patient } from '../types';
import { MEDICAL_CONDITIONS } from '../data/conditions';

interface PatientFormProps {
  onSubmit: (patient: Omit<Patient, 'id'>) => void;
  onClose: () => void;
  initialData?: Patient;
}

const WARDS = [
  'Cardiac ICU',
  'Cardiac Care Unit',
  'General Cardiology',
  'Post-Op Recovery',
  'Telemetry Unit'
];

export function PatientForm({ onSubmit, onClose, initialData }: PatientFormProps) {
  const [locationType, setLocationType] = useState<'Ward' | 'Clinic'>(
    initialData?.locationType || 'Ward'
  );
  const [conditionCategory, setConditionCategory] = useState(initialData?.conditionCategory || '');
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [condition, setCondition] = useState(initialData?.condition || '');
  const [isOtherCondition, setIsOtherCondition] = useState(false);
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);

  useEffect(() => {
    if (conditionCategory && !isOtherCategory) {
      const category = MEDICAL_CONDITIONS.find(c => c.category === conditionCategory);
      if (category) {
        setAvailableConditions(category.conditions);
        if (!category.conditions.includes(condition)) {
          setCondition('');
        }
      }
    }
  }, [conditionCategory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const locationData = locationType === 'Ward' 
      ? {
          wardName: formData.get('wardName') as string,
          bedNumber: formData.get('bedNumber') as string,
          clinicNumber: undefined
        }
      : {
          wardName: undefined,
          bedNumber: undefined,
          clinicNumber: formData.get('clinicNumber') as string
        };
    
    onSubmit({
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      gender: formData.get('gender') as Patient['gender'],
      conditionCategory: isOtherCategory ? formData.get('customCategory') as string : conditionCategory,
      condition: isOtherCondition ? formData.get('otherCondition') as string : condition,
      admissionDate: formData.get('admissionDate') as string,
      status: formData.get('status') as Patient['status'],
      remarks: formData.get('remarks') as string,
      locationType,
      ...locationData
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={initialData?.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              defaultValue={initialData?.age}
              required
              min="0"
              max="150"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              defaultValue={initialData?.gender}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Condition Category</label>
            <select
              value={isOtherCategory ? 'other' : conditionCategory}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setIsOtherCategory(true);
                  setConditionCategory('');
                  setAvailableConditions([]);
                } else {
                  setIsOtherCategory(false);
                  setConditionCategory(e.target.value);
                }
              }}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {MEDICAL_CONDITIONS.filter(c => c.category !== 'Other').map((category) => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
              <option value="other">Other (specify)</option>
            </select>
            {isOtherCategory && (
              <input
                type="text"
                name="customCategory"
                placeholder="Specify category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Specific Condition</label>
            {isOtherCategory ? (
              <input
                type="text"
                name="otherCondition"
                placeholder="Specify condition"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <>
                <select
                  value={isOtherCondition ? 'other' : condition}
                  onChange={(e) => {
                    if (e.target.value === 'other') {
                      setIsOtherCondition(true);
                      setCondition('');
                    } else {
                      setIsOtherCondition(false);
                      setCondition(e.target.value);
                    }
                  }}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select condition</option>
                  {availableConditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                  <option value="other">Other (specify)</option>
                </select>
                {isOtherCondition && (
                  <input
                    type="text"
                    name="otherCondition"
                    placeholder="Specify condition"
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location Type</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as 'Ward' | 'Clinic')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Ward">Ward</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>

          {locationType === 'Ward' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ward Name</label>
                <select
                  name="wardName"
                  defaultValue={initialData?.wardName}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select ward</option>
                  {WARDS.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bed Number</label>
                <input
                  type="text"
                  name="bedNumber"
                  defaultValue={initialData?.bedNumber}
                  required
                  placeholder="e.g., A-101"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Number</label>
              <input
                type="text"
                name="clinicNumber"
                defaultValue={initialData?.clinicNumber}
                required
                placeholder="e.g., C-2023"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              defaultValue={initialData?.admissionDate}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              name="remarks"
              defaultValue={initialData?.remarks}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any additional notes or remarks..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'} Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}