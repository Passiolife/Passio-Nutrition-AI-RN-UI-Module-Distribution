import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { AdvisorResponse } from '../../screens/advisor/model/advisorResponse';

export type AdvisorSessionType = {
  storedMessages: AdvisorResponse[] | undefined;
  storeMessageAtGlobal: (response: AdvisorResponse[]) => void;
};

// This context api is used for stored last previous message
export const AdvisorSessionContext = createContext<
  AdvisorSessionType | undefined
>(undefined);

export const useAdvisorSession = () => {
  const context = useContext(AdvisorSessionContext);
  if (!context)
    throw Error('useAdvisorResponse must be used inside AdvisorSessionContext');
  return context;
};

export const AdvisorSessionProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [response, setResponse] = useState<AdvisorResponse[]>();

  const setAdvisorResponseSession = useCallback((item: AdvisorResponse[]) => {
    setResponse(
      item.map((o) => {
        if (o.type === 'typing' || o.type === 'imageScanning') {
          return {
            ...o,
            type: 'sessionError',
          };
        }

        if (o.isLoading) {
          return {
            ...o,
            isLoading: false,
          };
        }
        return o;
      })
    );
  }, []);

  const value: AdvisorSessionType = useMemo(() => {
    return {
      storedMessages: response,
      storeMessageAtGlobal: setAdvisorResponseSession,
    };
  }, [response, setAdvisorResponseSession]);

  return (
    <AdvisorSessionContext.Provider value={value}>
      {children}
    </AdvisorSessionContext.Provider>
  );
};
