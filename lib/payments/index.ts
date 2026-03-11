/**
 * Payment system initialization
 * Sprint 08: Payments and Notifications
 */

import { paymentProviders } from './provider';
import { initializePayPalProvider } from './paypal';

// Register available payment providers
paymentProviders.register(initializePayPalProvider());

// Set PayPal as default (temporary)
paymentProviders.setDefault('paypal');

export { paymentProviders };
export * from './provider';
export * from './paypal';
