@objc(NutritionReportService)
class NutritionReportService: NSObject {
    
    @objc(generateNutritionPDF:withUserDetails:withDuration:withResolver:withRejecter:)
    func generateNutritionPDF(
        foodRecord: String,
        userDetails: String,
        duration: Float,
        resolve:@escaping RCTPromiseResolveBlock,
        reject:@escaping RCTPromiseRejectBlock
    ) -> Void {
        
        reject("", "error1.localizedDescription", Error.self as? Error)
    }
    
    
}
