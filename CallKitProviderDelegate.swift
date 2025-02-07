//
//  ProviderDelegate.swift
//  CallTutorial
//
//  Created by QuentinArguillere on 05/08/2020.
//  Copyright © 2020 BelledonneCommunications. All rights reserved.
//
import Foundation
import CallKit
import linphonesw
import AVFoundation

class CallKitProviderDelegate: NSObject {
    private let provider: CXProvider
    let mCallController = CXCallController()
    private var callManager: CallManager
    
    var incomingCallUUID: UUID?
    var outgoingCallUUID: UUID?
    
    init(callManager: CallManager) {
        self.callManager = callManager
        let providerConfiguration = CXProviderConfiguration(localizedName: Bundle.main.infoDictionary!["CFBundleName"] as! String)
        providerConfiguration.supportsVideo = true
        providerConfiguration.supportedHandleTypes = [.generic]
        providerConfiguration.maximumCallsPerCallGroup = 1
        providerConfiguration.maximumCallGroups = 1
        
        provider = CXProvider(configuration: providerConfiguration)
        super.init()
        provider.setDelegate(self, queue: nil)
    }
    
    func incomingCall(from address: String) {
        incomingCallUUID = UUID()
        let update = CXCallUpdate()
        update.remoteHandle = CXHandle(type: .generic, value: address)
        
        provider.reportNewIncomingCall(with: incomingCallUUID!, update: update, completion: { error in })
    }
    
    func startOutgoingCall(handle: String) {
        outgoingCallUUID = UUID()
        let handle = CXHandle(type: .generic, value: handle)
        let startCallAction = CXStartCallAction(call: outgoingCallUUID!, handle: handle)
        startCallAction.contactIdentifier = handle.value
        
        let transaction = CXTransaction(action: startCallAction)
        mCallController.request(transaction) { error in
            if let error = error {
                print("Error starting call: \(error.localizedDescription)")
            }
        }
    }
    
    func stopCall() {
        guard let callUUID = incomingCallUUID ?? outgoingCallUUID else { return }
        let endCallAction = CXEndCallAction(call: callUUID)
        let transaction = CXTransaction(action: endCallAction)
        mCallController.request(transaction, completion: { error in })
    }
    
    func reportOutgoingCallConnected(uuid: UUID) {
        provider.reportOutgoingCall(with: uuid, connectedAt: Date())
    }
    
    func reportCallEnded(uuid: UUID) {
        provider.reportCall(with: uuid, endedAt: Date(), reason: .failed)
    }
}

extension CallKitProviderDelegate: CXProviderDelegate {
    func providerDidReset(_ provider: CXProvider) {
        callManager.terminateCall()
    }
    
    func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
        callManager.terminateCall()
        action.fulfill()
    }
    
    func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
        callManager.acceptCall()
        provider.reportOutgoingCall(with: action.callUUID, connectedAt: Date())
        action.fulfill()
    }
    
    func provider(_ provider: CXProvider, perform action: CXStartCallAction) {
        callManager.configureAudioSession()
        provider.reportOutgoingCall(with: action.callUUID, startedConnectingAt: nil)
        action.fulfill()
    }
    
    func provider(_ provider: CXProvider, didActivate audioSession: AVAudioSession) {
        callManager.activateAudioSession(true)
    }
    
    func provider(_ provider: CXProvider, didDeactivate audioSession: AVAudioSession) {
        callManager.activateAudioSession(false)
    }
}
