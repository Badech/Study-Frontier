/**
 * Payment Provider Abstraction Layer
 * Sprint 08: Payments and Notifications
 * 
 * This abstraction allows swapping payment providers (PayPal → Moroccan gateway)
 * without changing application logic.
 */

export interface PaymentProvider {
  name: string;
  
  /**
   * Create an invoice/payment request
   */
  createInvoice(params: CreateInvoiceParams): Promise<InvoiceResult>;
  
  /**
   * Get invoice status from provider
   */
  getInvoiceStatus(invoiceId: string): Promise<InvoiceStatusResult>;
  
  /**
   * Cancel an invoice
   */
  cancelInvoice(invoiceId: string): Promise<boolean>;
  
  /**
   * Get payment details
   */
  getPaymentDetails(paymentId: string): Promise<PaymentDetailsResult>;
}

export interface CreateInvoiceParams {
  amount: number;
  currency: string;
  description: string;
  recipientEmail: string;
  recipientName: string;
  dueDate?: Date;
  items?: InvoiceItem[];
  metadata?: Record<string, any>;
}

export interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  unitAmount: number;
}

export interface InvoiceResult {
  success: boolean;
  invoiceId?: string;
  invoiceUrl?: string;
  error?: string;
}

export interface InvoiceStatusResult {
  status: 'draft' | 'sent' | 'paid' | 'cancelled' | 'refunded';
  paidAt?: Date;
  paymentId?: string;
}

export interface PaymentDetailsResult {
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: Date;
  payerEmail?: string;
}

/**
 * Payment provider registry
 */
class PaymentProviderRegistry {
  private providers = new Map<string, PaymentProvider>();
  private defaultProvider?: string;

  register(provider: PaymentProvider) {
    this.providers.set(provider.name, provider);
  }

  setDefault(providerName: string) {
    if (!this.providers.has(providerName)) {
      throw new Error(`Provider ${providerName} not registered`);
    }
    this.defaultProvider = providerName;
  }

  get(providerName?: string): PaymentProvider {
    const name = providerName || this.defaultProvider;
    if (!name) {
      throw new Error('No payment provider specified and no default set');
    }
    
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Payment provider ${name} not found`);
    }
    
    return provider;
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const paymentProviders = new PaymentProviderRegistry();
