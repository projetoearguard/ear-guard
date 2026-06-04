import Foundation

@objc public class EarGuard: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
