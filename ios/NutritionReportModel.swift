//
//  NutritionReportModel.swift
//  @passiolife/nutrition-ai-ui-ux
//
//  Created by Parth Gohel on 01/10/21.
//

import Foundation


class DayLogs: Decodable {

    var date: Date
    var records: [FoodRecord]

    init(
        date: Date,
        records:[FoodRecord]
    ) {
        self.date = date
        self.records = records
    }

}

struct FoodRecord: Decodable {

    let eventTimestamp: String
    let servingUnits: [ServingUnit]?
    let entityType: String?
    let selectedQuantity: Double?
    let meal: String
    let passioID: String
    let foodItems: [FoodItem]
    let uuid, name, selectedUnit: String


}

// MARK: - FoodItem
struct FoodItem: Decodable {

    let name: String?
    let parents: [Parent]?
    let entityType: String?
    let servingUnits: [ServingUnit]?
    let selectedUnit: String?
    let passioID: String?
    let selectedQuantity: Double?
    let computedWeight: ComputedWeight?
    let nutrients: [Nutrient]
    let barcode: String?
  

}

// MARK: - Parent
struct Parent: Decodable {
    let name, passioID: String
}

// MARK: - ComputedWeight
struct ComputedWeight: Decodable {
    let unit: String
    let value: Double
}

// MARK: - Nutrient
struct Nutrient: Decodable {
    let id: String
    let amount: Double
    let unit: String
}

// MARK: - ServingUnit
struct ServingUnit: Decodable {
    let mass: Double
    let unit: String
}

// MARK: - Sibling
struct Sibling: Decodable {
    let passioID, name: String
    let quantity: Int?
    let unitName: String?
}


enum CustomeError: Error {
    case unknownError(String)
}

extension Date {

    func dateFormatWithSuffix() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "EEEE, MMMM d'\(self.daySuffix())'"
        return dateFormatter.string(from: self)
    }

    func daySuffix() -> String {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.day], from: self)
        let dayOfMonth = components.day
        switch dayOfMonth {
        case 1, 21, 31:
            return "st"
        case 2, 22:
            return "nd"
        case 3, 23:
            return "rd"
        default:
            return "th"
        }
    }

    static func dates(from fromDate: Date, to toDate: Date) -> [Date] {
        var dates: [Date] = []
        var date = fromDate

        while date <= toDate {
            dates.append(date)
            guard let newDate = Calendar.current.date(byAdding: .day, value: 1, to: date) else { break }
            date = newDate
        }
        return dates
    }

  
}

struct UserProfile: Decodable {
    var firstName: String?
    var lastName: String?
    var age: Int?
    let caloriesTarget, carbsPercentage, proteinPercentage, fatPercentage: Int?
    let units, gender: String
    let height: Double
    let weight: Double
}
