//
//  ContentView.swift
//  CallKit tutorial
//
//  Created by QuentinArguillere on 09/09/2021.
//  Copyright © 2021 BelledonneCommunications. All rights reserved.
//
import SwiftUI

struct ContentView: View {
    @ObservedObject private var callManager = CallManager.shared
    @State private var selectedTab = 0
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        TabView(selection: $selectedTab) {
            DialPadView()
                .tabItem {
                    Image(systemName: "circle.grid.3x3.fill")
                    Text("撥號")
                }
                .tag(0)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("設置")
                }
                .tag(2)
        }
        .accentColor(.blue)
    }
}

struct DialPadView: View {
    @ObservedObject private var callManager = CallManager.shared
    @Environment(\.colorScheme) var colorScheme
    
    let dialPadButtons: [[DialPadButton]] = [
        [.init(digit: "1", letters: ""),
         .init(digit: "2", letters: "ABC"),
         .init(digit: "3", letters: "DEF")],
        [.init(digit: "4", letters: "GHI"),
         .init(digit: "5", letters: "JKL"),
         .init(digit: "6", letters: "MNO")],
        [.init(digit: "7", letters: "PQRS"),
         .init(digit: "8", letters: "TUV"),
         .init(digit: "9", letters: "WXYZ")],
        [.init(digit: "*", letters: ""),
         .init(digit: "0", letters: "+"),
         .init(digit: "#", letters: "")]
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            Spacer()
            
            Text(callManager.remoteAddress)
                .font(.system(size: 42, weight: .light))
                .foregroundColor(foregroundColor)
                .padding(.horizontal, 32)
                .padding(.bottom, 40)
                .lineLimit(1)
                .minimumScaleFactor(0.5)
                .frame(maxWidth: .infinity, alignment: .center)
            
            VStack(spacing: 16) {
                ForEach(dialPadButtons, id: \.self) { row in
                    HStack(spacing: 20) {
                        ForEach(row, id: \.digit) { button in
                            DialPadButtonView(button: button) {
                                callManager.remoteAddress += button.digit
                            }
                        }
                    }
                }
            }
            .padding(.bottom, 32)
            
            HStack(spacing: 24) {
                CallButton(action: {}, color: .clear, icon: "")
                    .frame(width: 70)
                    .opacity(0)
                    .disabled(true)
                CallButton(action: {
                    if !callManager.remoteAddress.isEmpty {
                        callManager.makeCall(to: callManager.remoteAddress)
                    }
                }, color: .green, icon: "phone.fill")
                if !callManager.remoteAddress.isEmpty {
                    CallButton(action: {
                        callManager.remoteAddress = String(callManager.remoteAddress.dropLast())
                    }, color: .secondary, icon: "delete.left.fill")
                        .frame(width: 70)
                } else {
                    Spacer()
                        .frame(width: 70)
                }
            }
            .padding(.bottom, 56)
        }
        .background(backgroundColor.edgesIgnoringSafeArea(.all))
    }
    
    var backgroundColor: Color {
        colorScheme == .dark ? Color.black : Color(UIColor.systemBackground)
    }
    
    var foregroundColor: Color {
        colorScheme == .dark ? .white : .black
    }
}

struct DialPadButton: Hashable {
    let digit: String
    let letters: String
}

struct DialPadButtonView: View {
    let button: DialPadButton
    let action: () -> Void
    @Environment(\.colorScheme) var colorScheme
    @State private var isPressed = false
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Text(button.digit)
                    .font(.system(size: 36, weight: .light))
                Text(button.letters)
                    .font(.system(size: 11, weight: .regular))
                    .foregroundColor(.gray)
            }
            .foregroundColor(foregroundColor)
            .frame(width: 82, height: 82)
            .background(buttonBackground)
            .clipShape(Circle())
            .scaleEffect(isPressed ? 0.95 : 1.0)
        }
        .pressEvents {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = true
            }
        } onRelease: {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = false
            }
        }
    }
    
    var buttonBackground: Color {
        if isPressed {
            return colorScheme == .dark ? Color(white: 0.3) : Color(white: 0.85)
        } else {
            return colorScheme == .dark ? Color(white: 0.2) : Color(white: 0.95)
        }
    }
    
    var foregroundColor: Color {
        colorScheme == .dark ? .white : .black
    }
}

struct CallButton: View {
    let action: () -> Void
    let color: Color
    let icon: String
    @State private var isPressed = false
    
    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 28, weight: .regular))
                .foregroundColor(.white)
                .frame(width: 70, height: 70)
                .background(color)
                .clipShape(Circle())
                .scaleEffect(isPressed ? 0.9 : 1.0)
        }
        .pressEvents {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = true
            }
        } onRelease: {
            withAnimation(.easeInOut(duration: 0.1)) {
                isPressed = false
            }
        }
    }
}

struct CallControlsView: View {
    @ObservedObject private var callManager = CallManager.shared
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        HStack(spacing: 30) {
            CallControlButton(action: { callManager.toggleSpeaker() },
                              imageName: callManager.isSpeakerEnabled ? "speaker.wave.2.fill" : "speaker.fill",
                              color: callManager.isSpeakerEnabled ? .white : buttonColor,
                              backgroundColor: callManager.isSpeakerEnabled ? .gray : .clear)
                    }
    }
    
    var buttonColor: Color {
        colorScheme == .dark ? .white : .black
    }
}

struct CallControlButton: View {
    let action: () -> Void
    let imageName: String
    let color: Color
    let backgroundColor: Color
    
    var body: some View {
        Button(action: action) {
            Image(systemName: imageName)
                .font(.system(size: 24))
                .foregroundColor(color)
                .frame(width: 60, height: 60)
                .background(backgroundColor)
                .clipShape(Circle())
        }
    }
}

struct SettingsView: View {
    @ObservedObject private var callManager = CallManager.shared
    @AppStorage("sipUsername") private var sipUsername = ""
    @AppStorage("sipPassword") private var sipPassword = ""
    @AppStorage("sipDomain") private var sipDomain = ""
    @State private var showingSaveAlert = false
    @State private var showingUnregisterAlert = false
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("SIP賬戶設置").foregroundColor(.gray)) {
                    TextField("用戶名", text: $sipUsername)
                        .textContentType(.username)
                        .autocapitalization(.none)
                    SecureField("密碼", text: $sipPassword)
                        .textContentType(.password)
                    TextField("伺服器域名", text: $sipDomain)
                        .textContentType(.URL)
                        .autocapitalization(.none)
                        .keyboardType(.URL)
                }
                
                Section {
                    Button(action: { showingSaveAlert = true }) {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.blue)
                            Text("保存並註冊")
                        }
                    }
                    .alert(isPresented: $showingSaveAlert) {
                        Alert(
                            title: Text("確認註冊"),
                            message: Text("確定要使用當前設置註冊SIP賬戶嗎？"),
                            primaryButton: .default(Text("確定")) {
                                callManager.updateSipAccount(username: sipUsername, password: sipPassword, domain: sipDomain)
                            },
                            secondaryButton: .cancel(Text("取消"))
                        )
                    }
                    
                    Button(action: { showingUnregisterAlert = true }) {
                        HStack {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.red)
                            Text("取消註冊")
                                .foregroundColor(.red)
                        }
                    }
                    .alert(isPresented: $showingUnregisterAlert) {
                        Alert(
                            title: Text("確認取消註冊"),
                            message: Text("確定要取消當前SIP賬戶的註冊嗎？"),
                            primaryButton: .destructive(Text("確定")) {
                                callManager.unregisterSipAccount()
                            },
                            secondaryButton: .cancel(Text("取消"))
                        )
                    }
                }
                
                Section(header: Text("賬戶狀態").foregroundColor(.gray)) {
                    HStack {
                        Image(systemName: callManager.isLoggedIn ? "checkmark.circle.fill" : "xmark.circle.fill")
                            .foregroundColor(callManager.isLoggedIn ? .green : .red)
                        Text(callManager.isLoggedIn ? "已註冊" : "未註冊")
                            .foregroundColor(callManager.isLoggedIn ? .green : .red)
                    }
                }
            }
            .navigationBarTitle("設置", displayMode: .large)
        }
    }
}

extension View {
    func pressEvents(onPress: @escaping (() -> Void), onRelease: @escaping (() -> Void)) -> some View {
        modifier(PressActions(onPress: {
            onPress()
        }, onRelease: {
            onRelease()
        }))
    }
}

struct PressActions: ViewModifier {
    var onPress: () -> Void
    var onRelease: () -> Void
    
    func body(content: Content) -> some View {
        content
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged({ _ in
                        onPress()
                    })
                    .onEnded({ _ in
                        onRelease()
                    })
            )
    }
}
