package com.reactnativenutritionux

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.*

class LocaleUtilsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "LocaleUtils"
  }

  @ReactMethod
  fun usesMetricSystem(
  ): Boolean {
    Log.d("device_country",this.deviceCountry().capitalized())
    return when (this.deviceCountry().capitalized()) {
        "US" -> {
          false
        }
        "LR" -> {
          false
        }
        "MM" -> {
          false
        }
        else -> {
          true
        }
    }
  }
  private fun deviceCountry(): String {
    return Locale.getDefault().country
  }
}
// Extension
fun String.capitalized(): String {
  return this.replaceFirstChar {
    if (it.isLowerCase())
      it.titlecase(Locale.getDefault())
    else it.toString()
  }
}
