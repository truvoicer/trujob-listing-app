import { ShippingService } from '@/library/services/cashier/shipping/ShippingService';
import React from 'react'

export const ShippingProviderContext = React.createContext(ShippingService.CONTEXT_DATA);
