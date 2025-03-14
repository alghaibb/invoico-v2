import { create } from "zustand";

interface ModalState {
  sendInvoiceModal: boolean;
  deleteInvoiceModal: boolean;
  openSendInvoiceModal: () => void;
  closeSendInvoiceModal: () => void;
  openDeleteInvoiceModal: () => void;
  closeDeleteInvoiceModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  sendInvoiceModal: false,
  deleteInvoiceModal: false,

  openSendInvoiceModal: () => set({ sendInvoiceModal: true }),
  closeSendInvoiceModal: () => set({ sendInvoiceModal: false }),

  openDeleteInvoiceModal: () => set({ deleteInvoiceModal: true }),
  closeDeleteInvoiceModal: () => set({ deleteInvoiceModal: false }),
}))