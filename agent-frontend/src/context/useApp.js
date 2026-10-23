import { useContext } from 'react';
import { AppContext } from './appContextInstance.js';
export function useApp() { return useContext(AppContext); }
