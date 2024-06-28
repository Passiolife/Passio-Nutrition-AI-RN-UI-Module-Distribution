import { useEffect, useRef, useState } from 'react';

import {
  NutritionAdvisor,
  PassioAdvisorFoodInfo,
  PassioAdvisorMessageResultStatus,
  PassioAdvisorResponse,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type {
  AdvisorResponse,
  RecordType,
} from '../screens/advisor/model/advisorResponse';
import { LayoutAnimation, type FlatList } from 'react-native';
import uuid4 from 'react-native-uuid';

export type SDKStatus = 'Success' | 'Error' | 'Init';

const defaultResponse: AdvisorResponse = {
  type: 'defaultResponse',
  defaultResponse: `
  **Welcome! I am your AI Nutrition Advisor**
 
  **You can ask me things like:**  
  • How many calories are in a yogurt?  
  • Create me a recipe for dinner?  
  • How can I adjust my diet for heart health?

  Let's chat!
  `,
  uuID: uuid4.v4() as string,
};

export const useNutritionAdvisor = ({ key }: { key: string }) => {
  const [configureStatus, setConfigureStatus] = useState<SDKStatus>('Init');
  const [sdkError, setSDKError] = useState<string | undefined>(undefined);

  const [messages, setMessage] = useState<AdvisorResponse[]>([]);
  const [sending, setSending] = useState(false);
  const [ingredientAdvisorResponse, setIngredientAdvisorResponse] =
    useState<PassioAdvisorResponse | null>(null);
  const listRef = useRef<FlatList>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessage([defaultResponse]);
        firstRender.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const initializeNutritionAdvisor = async () => {
      try {
        const status = await NutritionAdvisor.configure(key);
        if (status?.status === 'Success') {
          const conversationResponse =
            await NutritionAdvisor.initConversation();
          setConfigureStatus(
            conversationResponse?.status === 'Success' ? 'Success' : 'Error'
          );
        } else {
          setConfigureStatus('Error');
          setSDKError(status?.message);
        }
      } catch (err) {
        setConfigureStatus('Error');
        setSDKError('Error');
      }
    };

    initializeNutritionAdvisor();
  }, [key]);

  const handleAdvisorResponse = async (
    response: PassioAdvisorMessageResultStatus | null,
    message: string | undefined
  ) => {
    setMessage((item) => {
      if (response?.status === 'Success') {
        const chatResponse: AdvisorResponse = {
          type: 'response',
          response: response.response,
          uuID: uuid4.v4() as string,
        };
        return [...item.filter((it) => it.type !== 'typing'), chatResponse];
      } else {
        const chatResponse: AdvisorResponse = {
          type: 'response',
          response: null,
          message: message,
          error: response?.message,
          uuID: uuid4.v4() as string,
        };
        return [...item.filter((it) => it.type !== 'typing'), chatResponse];
      }
    });
    jumpToLast();
  };

  const jumpToLast = () => {
    setTimeout(() => {
      listRef?.current?.scrollToEnd({
        animated: true,
      });
    }, 300);
  };

  const handleImageResponse = async (
    records: PassioAdvisorFoodInfo[],
    recordType: RecordType
  ) => {
    if (records.length === 0) {
      setMessage((item) => {
        const chatResponse: AdvisorResponse = {
          type: 'response',
          error: "I'm unable to provide a response.",
          uuID: uuid4.v4() as string,
        };
        return [
          ...item.filter((it) => it.type !== 'imageScanning'),
          chatResponse,
        ];
      });
    } else {
      setMessage((item) => {
        const chatResponse: AdvisorResponse = {
          type: 'records',
          recordType: recordType,
          uuID: uuid4.v4() as string,
          records: records.map((record, index) => {
            return {
              ...record,
              index: index,
            };
          }),
        };
        return [
          ...item.filter((it) => it.type !== 'imageScanning'),
          chatResponse,
        ];
      });
    }
    jumpToLast();
  };

  const sendMessage = async (message: string) => {
    if (message.trim().length === 0) {
      return;
    }
    setMessage((item) => {
      return [
        ...item,
        {
          type: 'text',
          message: message,
          uuID: uuid4.v4() as string,
        },
        {
          type: 'typing',
          uuID: uuid4.v4() as string,
        },
      ];
    });
    setSending(true);
    jumpToLast();
    const response = await NutritionAdvisor.sendMessage(message);
    setSending(false);
    handleAdvisorResponse(response, message);
  };

  const sendImages = async (images: string[]) => {
    setMessage((item) => {
      return [
        ...item,
        {
          type: 'image',
          uri: images,
          uuID: uuid4.v4() as string,
        },
        {
          type: 'imageScanning',
          uuID: uuid4.v4() as string,
        },
      ];
    });
    setSending(true);
    jumpToLast();
    try {
      let foodRecords: PassioAdvisorFoodInfo[] = [];
      setSending(true);
      for (const item of images) {
        try {
          const response = await NutritionAdvisor.sendImage(item);
          if (
            response?.status === 'Success' &&
            response.response?.extractedIngredients
          ) {
            foodRecords = [
              ...foodRecords,
              ...(response.response?.extractedIngredients ?? []),
            ];
          }
        } catch (err) {}
      }

      handleImageResponse(foodRecords, 'image');
    } catch (err) {
      handleImageResponse([], 'image');
    } finally {
      setSending(false);
    }
  };

  const fetchIngredients = async (response: AdvisorResponse) => {
    if (response.response) {
      setSending(true);
      makeResponseLoadingState(response.uuID, true);
      const responseOfIngredients = await NutritionAdvisor.fetchIngredients(
        response.response
      );
      if (responseOfIngredients?.status === 'Success') {
        handleImageResponse(
          responseOfIngredients?.response?.extractedIngredients ?? [],
          'searchTool'
        );
      } else {
      }
      makeResponseLoadingState(response.uuID, false);
      setSending(false);
    }
  };

  const makeResponseLoadingState = (uuid: string, isLoading?: boolean) => {
    setMessage((item) => {
      return item.map((r) => {
        if (r.uuID === uuid) {
          return {
            ...r,
            isLoading: isLoading,
          };
        } else {
          return r;
        }
      });
    });
  };

  return {
    configureStatus,
    messages,
    ingredientAdvisorResponse,
    sending,
    listRef,
    sdkError,
    sendMessage,
    setMessage,
    makeResponseLoadingState,
    sendImages,
    fetchIngredients,
    setIngredientAdvisorResponse,
    jumpToLast,
  };
};
