package com.reactnativenutritionux

import FoodItem

data class FoodLog(
  val eventTimestamp: String,
  val selectedQuantity: Float,
  val selectedUnit: String,
  val name: String,
  val uuid: String,
  val foodItems: List<FoodItem>
)
