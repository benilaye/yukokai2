import React, { createContext, useContext, useState } from 'react';
import { Member, Payment } from '../types';
import { generateQRCodeData } from '../utils/qrCodeGenerator';

interface MemberContextType {
  members: Member[];
  payments: Payment[];
  addMember: (member: Omit<Member, 'id' | 'qrCode'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const addMember = (memberData: Omit<Member, 'id' | 'qrCode'>) => {
    const id = Date.now().toString();
    const newMember: Member = {
      ...memberData,
      id,
      qrCode: generateQRCodeData(id),
    };
    setMembers([...members, newMember]);
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (paymentId: string, updates: Partial<Payment>) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId ? { ...payment, ...updates } : payment
    ));
  };

  return (
    <MemberContext.Provider value={{ members, payments, addMember, addPayment, updatePayment }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};