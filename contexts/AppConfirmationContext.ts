import { ConfirmationService } from '@/library/services/confirmation/ConfirmationService';
import React from 'react'

export const AppConfirmationContext = React.createContext(ConfirmationService.INIT_DATA);
