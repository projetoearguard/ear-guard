// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "EarGuard",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "EarGuard",
            targets: ["EarGuardPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "EarGuardPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/EarGuardPlugin"),
        .testTarget(
            name: "EarGuardPluginTests",
            dependencies: ["EarGuardPlugin"],
            path: "ios/Tests/EarGuardPluginTests")
    ]
)