'use client';

import Modals from '@/components/modals/modals';
import React, { createContext, useState } from 'react';

interface ModalContextType {
  modals: Record<ModalName, boolean>;
  setModals: React.Dispatch<React.SetStateAction<Record<ModalName, boolean>>>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

type ModalName =
  | 'daily-attendance'
  | 'personal-modal'
  | 'change-password-modal'
  | 'name-group-modal'
  | 'profile-modal'
  | 'group-setting-modal'
  | 'other-user-modal'
  | 'user-list-modal'
  | 'create-group-modal'
  | 'send-card-modal';

const defaultModals: Record<ModalName, boolean> = {
  'daily-attendance': false,
  'personal-modal': false,
  'change-password-modal': false,
  'name-group-modal': false,
  'profile-modal': false,
  'group-setting-modal': false,
  'other-user-modal': false,
  'user-list-modal': false,
  'create-group-modal': false,
  'send-card-modal': false,
};

const ModalProvider: React.FC<Props> = ({ children }) => {
  const [modals, setModals] = useState<Record<ModalName, boolean>>(defaultModals);

  return (
    <ModalContext.Provider value={{ modals, setModals }}>
      {children}
      <Modals />
    </ModalContext.Provider>
  );
};

export function useModalContext() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

export { ModalContext, ModalProvider };
