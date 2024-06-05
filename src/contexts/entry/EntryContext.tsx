import React, { useContext } from 'react';
import type { Entry } from './Entry';

const EntryContext = React.createContext({} as Entry);

export const useEntry = () => useContext(EntryContext);

interface EntryProviderProps extends React.PropsWithChildren {
  entry: Entry;
}

export const EntryProvider = ({ entry, children }: EntryProviderProps) => (
  <EntryContext.Provider value={entry}>{children}</EntryContext.Provider>
);
