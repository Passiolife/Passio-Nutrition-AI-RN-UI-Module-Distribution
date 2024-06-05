import React from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import { exploreAssets } from '../../assets';

import type { ActionPlan, ActionPlanType } from '../../models';
import { actionPlanViewStyle } from './actionPlanStyle';

interface Props {
  actionPlan: ActionPlan;
  activateActionPlan?: ActionPlanType | undefined | null;
  onActionPlanPress?: (actionPlan: ActionPlan) => void;
}

export const ActionPlanView = (props: Props) => {
  const { actionPlan, activateActionPlan, onActionPlanPress } = props;
  return (
    <TouchableOpacity onPress={() => onActionPlanPress?.(actionPlan)}>
      <View style={actionPlanViewStyle.container}>
        <ImageBackground
          source={actionPlan.icon}
          borderRadius={16}
          style={actionPlanViewStyle.image}
        >
          {activateActionPlan === actionPlan.actionPlanType && (
            <ImageBackground
              source={exploreAssets.blackCircle}
              resizeMethod="resize"
              style={actionPlanViewStyle.selected}
            >
              <Image
                source={exploreAssets.whiteRight}
                style={actionPlanViewStyle.right}
              />
            </ImageBackground>
          )}
        </ImageBackground>

        <Text style={actionPlanViewStyle.text}>{actionPlan.name}</Text>
      </View>
    </TouchableOpacity>
  );
};
