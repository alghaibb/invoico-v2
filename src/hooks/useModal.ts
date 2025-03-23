import { create } from "zustand";

interface ModalState {
  sendInvoiceModal: boolean;
  deleteInvoiceModal: boolean;
  subscriptionModal: boolean;
  openSendInvoiceModal: () => void;
  closeSendInvoiceModal: () => void;
  openDeleteInvoiceModal: () => void;
  closeDeleteInvoiceModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  sendInvoiceModal: false,
  deleteInvoiceModal: false,
  subscriptionModal: false,

  openSendInvoiceModal: () => set({ sendInvoiceModal: true }),
  closeSendInvoiceModal: () => set({ sendInvoiceModal: false }),

  openDeleteInvoiceModal: () => set({ deleteInvoiceModal: true }),
  closeDeleteInvoiceModal: () => set({ deleteInvoiceModal: false }),

  openSubscriptionModal: () => set({ subscriptionModal: true }),
  closeSubscriptionModal: () => set({ subscriptionModal: false }),
}));