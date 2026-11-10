

import React from "react"
import { X } from "lucide-react"

interface ApproveDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
}

const ApproveDetailsModal: React.FC<ApproveDetailsModalProps> = ({ isOpen, onClose, onApprove }) => {
  const [isConfirmed, setIsConfirmed] = React.useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Approve Professional details</h2>
          <p className="text-gray-600 mt-2">
            Confirm that all information aligns with the uploaded supporting documents
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm">Therapist full name</p>
          </div>

          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm">Licence issuing authority</p>
          </div>

          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm">Licence no</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-600">I confirm to have verified all the above information</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go back
          </button>
          <button
            onClick={onApprove}
            disabled={!isConfirmed}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isConfirmed
                ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                : "bg-green-400 cursor-not-allowed"
            }`}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApproveDetailsModal

