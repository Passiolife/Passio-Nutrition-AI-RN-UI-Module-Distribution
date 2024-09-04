require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "react-native-nutrition-ux"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.ios.deployment_target = '13.0'
  s.source       = { :git => "https://github.com/Passiolife/Passio-Nutrition-AI-RN-UI-Module-Distribution.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.public_header_files = 'ios/*.h'
  s.swift_version = "5"

  s.dependency "React-Core"
  s.dependency "lottie-ios"
  s.dependency "react-native-slider"
  s.dependency "ReactNativePassioSDK"
  s.dependency "RNDateTimePicker"
  s.dependency "RNReanimated"
  s.dependency "RNGestureHandler"
  s.dependency "react-native-safe-area-context"
  s.dependency "RNLinearGradient"
  s.dependency "RNSVG"
  s.dependency "react-native-sqlite-storage"
  s.dependency "react-native-voice"
  s.dependency "NotifeeCore"
  s.dependency "RNAsyncStorage"
  s.dependency "RNScreens"
  s.dependency "VisionCamera"
  s.dependency "react-native-image-picker"
  s.dependency "RNFS"
  
  # Don't install the dependencies when we run `pod install` in the old architecture.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
   end
end
