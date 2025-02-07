//
//  AppDelegate.swift
//  CallKitTutorial
//
//  Created by QuentinArguillere on 10/08/2020.
//  Copyright © 2020 BelledonneCommunications. All rights reserved.
//
import UIKit
import SwiftUI

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    // MARK: - Properties
    private let pushNotificationManager = PushNotificationManager.shared
    private let callManager = CallManager.shared
    
    // MARK: - Application Lifecycle
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        setupPushNotifications()
        return true
    }
    
    private func setupPushNotifications() {
        pushNotificationManager.registerForPushNotifications()
        NSLog("推送服務初始化完成")
    }
    
    // MARK: - Push Notification Handling
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        pushNotificationManager.handlePushRegistration(deviceToken: deviceToken)
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any]) {
        pushNotificationManager.handlePushNotification(userInfo)
    }
    
    // MARK: - UISceneSession Lifecycle
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
    
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {}
}
