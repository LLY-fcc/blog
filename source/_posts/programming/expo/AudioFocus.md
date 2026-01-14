先看代码
```tsx
import { useVideoPlayer, VideoView } from 'expo-video';

import React from 'react';

import { ViewProps } from 'react-native';

  

interface VideoProps {

url: string;

style?: ViewProps['style'];

}

  

export function Video({ url, style }: VideoProps) {

const player = useVideoPlayer(url, (p) => {

if (p) {

p.loop = true;

p.muted = true;

p.play();

}

});

  

return <VideoView player={player} style={style} contentFit="cover" nativeControls={false} />;

}
```
这是一个简单的视频播放组件，并且在 ios 表现一切正常，但是在 android 平台无法播放（更准确的说，是播放了极短的一段时间后就被暂停了），为了解释这个现象，我需要描述下业务背景：

这是一个视频通话组件的子组件，负责在建立通话链路的间隙播放一些视频，同时还会播放通话铃声。

正是因为安卓系统存在”音频焦点“机制，统一之间仅允许一个应用播放声音（静音播放的视频也不例外），如果检测到超过一个应用占用音频轨道，其会保留最新激活的应用，并暂停其它应用。

解决方案很简单，动态激活，监听视频播放状态，如果发现被暂停就重新播放

```tsx

import { useVideoPlayer, VideoView } from 'expo-video';

import React from 'react';

import { ViewProps } from 'react-native';

  

interface VideoProps {

url: string;

style?: ViewProps['style'];

}

  

export function Video({ url, style }: VideoProps) {

const player = useVideoPlayer(url, (p) => {

p.loop = true;

p.muted = true;

p.addListener('statusChange', ({ status }) => {

if (status === 'readyToPlay') {

p.play();

}

})

/**

* Android 音频焦点问题，当铃声播放时会导致视频被暂停

*/

p.addListener('playingChange', ({ isPlaying }) => {

if (!isPlaying) {

p.play()

}

})

});

  

return <VideoView key={url} player={player} style={style} contentFit="cover" nativeControls={false} />;

}
```