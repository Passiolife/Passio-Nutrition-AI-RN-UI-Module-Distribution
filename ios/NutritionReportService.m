#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NutritionReportService, NSObject)

RCT_EXTERN_METHOD(generateNutritionPDF:(NSString *)foodRecord withUserDetails: (NSString *)userDetails withDuration: (float)duration
				  withResolver:(RCTPromiseResolveBlock)resolve
				  withRejecter:(RCTPromiseRejectBlock)reject)

@end
