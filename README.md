# shithappens.rf.gd
A PWA that keeps track of your number twos and displays related statistics

## What & Why?
[shithappens](https://shithappens.rf.gd/) is a personal project idea that came to me during a hospital stay in which I got a small intestine resection due to my crohn's disease. There are already a lot of apps out there that track your toilet habits but they are either lite versions with limited tracking abilities and features or bloated with ads and other useless stuff (at least for my use case). So I came up with my own simple design.

## Installation
Since this is basically a website you can use it directly in a browser by visiting [shithappens.rf.gd](https://shithappens.rf.gd/). However for the best user experience I recommend using it on a mobile device as a [Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app).

### iOS & Safari
1. Open the site in Safari.
2. Press the 'share' button.
3. Scroll down to 'Add to Home Screen'
4. Optional: Change the name to something you like. (Default is 'Shit Happens!')
5. Press 'Add'

## How it works
The app is pretty self-explanatory. It uses localStorage to save the data on your device. The PWA app stores data independently of your browser. That means data stored from the mobile browser website won't update the PWA instance and vice versa. Using localStorage also means that your data will be lost if you clear stuff like browser cache or remove the app from the home screen. For this I implemented import and export functionality under the 'settings' tab. You can export your data as a JSON file and store it locally on your device. I recommend doing that everytime before you remove the app from your homescreen or want to clear your caches so that your precious poo data won't be flushed down the toilet ¯\_(ツ)_/¯.

Feel free to use this code as a template for creating your own tracking app. You could easily customize the code to track basically anything. I'm also not a designer so use the css to make the UI prettier and add your own icons, color palettes and stuff :)

## Language support
Since this is basically an app tailored for only my personal specific needs it is only available in german. In the code i'm constantly switching between english and german comments. It's a bit annoying I know. I will do some revisions in the future. Probably (maybe not).

