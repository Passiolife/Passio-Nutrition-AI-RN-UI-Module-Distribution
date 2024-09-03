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


  # Add all third-party library dependencies here
  s.dependency "lottie-ios", "~> 3.1.8"
  s.dependency "lottie-react-native", :git => 'https://github.com/lottie-react-native/lottie-react-native.git'
  s.dependency "@react-native-community/slider"
  s.dependency "react-native-reanimated", :path => "../node_modules/react-native-reanimated"
  s.dependency "react-native-gesture-handler", :path => "../node_modules/react-native-gesture-handler"
  s.dependency "luxon"
  s.dependency "react-native-safe-area-context"
  s.dependency "react-native-linear-gradient"
  s.dependency "react-native-svg"
  s.dependency "react-native-sqlite-storage"
  s.dependency "@react-native-voice/voice"
  s.dependency "@notifee/react-native"
  s.dependency "@react-native-async-storage/async-storage"
  s.dependency "react-native-screens"
  s.dependency "react-native-vision-camera"
  s.dependency "react-native-image-picker"
  s.dependency "react-native-keyboard-aware-scroll-view"
  s.dependency "react-native-fs"
  s.dependency "@react-native-community/datetimepicker"
  s.dependency "@passiolife/nutritionai-react-native-sdk-v3"
  
# Post-install script (optional) to handle additional setup if needed
s.pod_target_xcconfig = { 
  'OTHER_SWIFT_FLAGS' => '-D COCOAPODS',
  'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' # Exclude arm64 simulator builds if needed
}

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
