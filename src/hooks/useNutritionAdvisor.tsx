import { useEffect, useRef, useState } from 'react';

import {
  NutritionAdvisor,
  PassioAdvisorFoodInfo,
  PassioAdvisorMessageResultStatus,
  PassioAdvisorResponse,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { AdvisorResponse } from '../screens/advisor/model/advisorResponse';
import { LayoutAnimation, type FlatList } from 'react-native';

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
};

export const useNutritionAdvisor = ({ key }: { key: string }) => {
  const [configureStatus, setConfigureStatus] = useState<SDKStatus>('Init');
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
        }
      } catch (err) {
        setConfigureStatus('Error');
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
        };
        return [...item.filter((it) => it.type !== 'typing'), chatResponse];
      } else {
        const chatResponse: AdvisorResponse = {
          type: 'response',
          response: null,
          message: message,
          error: response?.message,
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
    uris: string[]
  ) => {
    if (records.length === 0) {
      setMessage((item) => {
        const chatResponse: AdvisorResponse = {
          type: 'response',
          error: "I'm unable to provide a response.",
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
          records: records,
          uri: uris,
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
        },
        {
          type: 'typing',
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
        },
        {
          type: 'imageScanning',
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

      handleImageResponse(foodRecords, images);
    } catch (err) {
      handleImageResponse([], images);
    } finally {
      setSending(false);
    }
  };

  const fetchIngredients = async (response: PassioAdvisorResponse) => {
    setSending(true);
    const responseOfIngredients =
      await NutritionAdvisor.fetchIngredients(response);
    if (responseOfIngredients?.status === 'Success') {
      setIngredientAdvisorResponse(responseOfIngredients.response);
    } else {
    }
    setSending(false);
  };

  return {
    configureStatus,
    messages,
    ingredientAdvisorResponse,
    sending,
    listRef,
    sendMessage,
    sendImages,
    fetchIngredients,
    setIngredientAdvisorResponse,
    jumpToLast,
  };
};
