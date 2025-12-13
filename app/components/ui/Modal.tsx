import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ModalProps {
  title?: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "danger" | "success";
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  showConfirm = false,
  confirmText = "Konfirmasi",
  cancelText = "Tutup",
  type = "default",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              {type === "danger" && (
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 leading-tight pt-1">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-800 mb-8 leading-relaxed ml-1">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all text-sm"
            >
              {cancelText}
            </button>
            {showConfirm && (
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 text-sm ${
                  type === "danger"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                    : "bg-coffee-600 hover:bg-coffee-700 shadow-coffee-200"
                }`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
