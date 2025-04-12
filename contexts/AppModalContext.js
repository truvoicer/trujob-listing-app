import { ModalService } from '@/library/services/modal/ModalService';
import React from 'react'

export const AppModalContext = React.createContext(ModalService.INIT_CONTEXT_DATA);
