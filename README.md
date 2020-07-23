<h2>FoodIt <i>Fighting food waste </i></h2>

[<img src="https://devimages-cdn.apple.com/app-store/marketing/guidelines/images/badge-example-alternate_2x.png" height="48">](https://itunes.apple.com/us/app/hekla/id1405096983?mt=8)

iOS and Android client for Hacker News. Inspired by the Apollo client for Reddit.

##### App features:

 - Tabbed interface for easy navigating
 - Browse reminder items, full-text search support
 - Notifications when your items approaching expiration date
 - Social login: Facebook, Google and Apple. 
 - Share your list with family members.
 - Supports Dark mode

##### Beta Screenshots
<img src="./src/assets/screenshots/login.png" height="500" /> 
<img src="./src/assets/screenshots/home.png" height="500" />
<img src="./src/assets/screenshots/scan.png" height="500" />


## Development features
 - TypeScript
 - Gradle 4
 - Cocoapods
 - CodePush
 - mobx and mobx-state-tree
 - react-native-navigation v2
 - react-native-config
 - JavaScriptCore on Android
 - Keychain to store sensitive data
 - CSS Modules with Stylus
 - patch-package for custom native code

## Getting Started

You will need to grab your own `google-services.json` and `GoogleService-Info.plist`. Head over to firebase.com and create a new application.

You will then need to modify your configuration files to match the Hacker News API:

`./android/app/google-services.json`:
```js
    "firebase_url": "https://hacker-news.firebaseio.com"
```

`./ios/Hekla/GoogleService-Info.plist`
```xml
	<key>DATABASE_URL</key>
	<string>https://hacker-news.firebaseio.com</string>
```

## Contributing

If you are interested in helping out, feel free to submit issues, pull-requests or even [contact me](mailto:birkir.gudjonsson@gmail.com). I am open to all kind of contributions.

## License

This project is [MIT licensed](/LICENSE.md)

