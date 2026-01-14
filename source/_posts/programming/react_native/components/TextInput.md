# 实现自动大小写转换功能

>react-native: 0.81.5
>expo: 54.0.31
>android: 15
>device: Galaxy A16 5G
>ui: one ui 7.0

一个很自然的想法是通过监听 change 事件，然后修改 change 事件传递的用户输入字符

```jsx
<TextInput
value={value}
onChangeText={(text) => setValue(text.toLowerCase())}
>
</TextInput>
```

但是在 Android 平台，某些系统会提供一个 "composing underline" 或者叫做 "autosuggestions"，具体表现为在输入框的文字下方有黑色的线条，它的作用是在用户最终确认输入前（输入框失去焦点/点击键盘右下方的 return/done）提供经智能建议/拼写检查供用户替换（系统建议一般存在于输入法上方的信息栏），如果我们在此期间修改了用户输入的内容，将会导致出现下一次输入会使用自动建议内容替换用户主动输入字符的 Bug：

```txt
# 假设输入框存在原始字符: initial
# input: 用户输入
# suggestion: 系统建议
# ouput: change 事件返回的 text 内容

# input
A
# suggestion: initial, ...
# output
a
# input
a
# suggestion: initial, ...
# output:
initial # 在这次输出中, 系统建议 initial 替代了用户输入的 a
```

更改 TextInput 组件的 keyboardType 属性是可选的解决方案之一：

```jsx
<TextInput
value={value}
onChangeText={(text) => setValue(text.toLowerCase())}

keyboardType="visible-password"
>
</TextInput>
```

社区对这个问题早有记载：

[Github](https://github.com/facebook/react-native/issues/35590?utm_source=chatgpt.com)
[StackOverflow](https://stackoverflow.com/questions/50143702/react-native-android-textinput-autocorrect-false-does-not-disable-suggestions?utm_source=chatgpt.com)
