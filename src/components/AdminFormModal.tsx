import React, { FormEvent } from 'react';

interface AdminFormModalProps {
  isOpen: boolean;
  title: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: React.ReactNode;
  submitButtonText: string;
}

export function AdminFormModal({
  isOpen,
  title,
  onSubmit,
  onClose,
  children,
  submitButtonText,
}: AdminFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={onSubmit} className="modal-form">
        <h3>{title}</h3>
        {children}
        <div className="form-actions">
          <button type="button" onClick={onClose}>إلغاء</button>
          <button type="submit">{submitButtonText}</button>
        </div>
      </form>
    </div>
  );
}
