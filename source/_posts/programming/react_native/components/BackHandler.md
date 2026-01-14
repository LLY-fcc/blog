# Android 不及时销毁 BackHandler 导致系统手势返回失灵

>react-native: 0.81.5
>expo: 54.0.31
>android: 15
>device: Galaxy A16 5G
>ui: one ui 7.0

我在一个大范围使用的 Hook 内定义了 BackHandler 的返回逻辑

```tsx
import {BackHandler, useRef, useEffect} from 'react-native'

export function useX() {

const visible = useRef(false)

useEffect(() => {

	const backHandler = BackHandler.addEventlistener('', () => {
			if (visible) {
			// do somthing
			}
			return true
		})
	})
	
	return () => {
		backHandler.remove()
	}
}
```

因为这个 Hook 被大范围使用，导致 `useEffect` 的副作用清理函数很难被调用，这在 ios 平台没有什么影响；但是直接导致在 android 平台，一旦该 hook 被初始化并未清理，系统返回手势就会失效，解决方案很简单：**仅在需要的时候注册 `BackHandler` ，在使用过后及时清理**。

在我的使用场景中，`BackHandler` 被用作弹窗的手势关闭逻辑，因为弹窗组件可以通过 `visible` 动态注册、销毁 `BackHandler` ，所以我将这段逻辑从全局使用的 Hook 移动到了具体组件，并动态注册、销毁，最终解决 android 系统上的问题。